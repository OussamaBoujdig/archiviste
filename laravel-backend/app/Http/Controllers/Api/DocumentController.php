<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Folder;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Document::query();

        if (!$user->isSuperAdmin()) {
            $query->where('company_id', $user->company_id);
        }

        if ($search = $request->get('search')) {
            $query->search($search);
        }

        if ($folderId = $request->get('folder_id')) {
            $query->where('folder_id', $folderId);
        }

        if ($category = $request->get('category')) {
            $query->byCategory($category);
        }

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        } else {
            $query->active();
        }

        $documents = $query->with(['folder', 'uploader'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return $this->paginated($documents);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:104857600', // 100MB max
            'folder_id' => 'nullable|exists:folders,id',
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|in:facture,contrat,rapport,correspondance,legal,rh,autre',
            'tags' => 'nullable|array',
            'document_date' => 'nullable|date',
        ]);

        $user = $request->user();
        $company = $user->company;

        if (!$user->canUpload()) {
            return $this->error('Vous n\'avez pas la permission de téléverser des fichiers.', 403);
        }

        $file = $request->file('file');
        $fileSize = $file->getSize();

        if ($company && !$company->canUpload($fileSize)) {
            return $this->error('Limite de stockage atteinte.', 422);
        }

        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $fileName = Str::uuid() . '.' . $extension;
        $path = $file->storeAs('documents/' . ($company?->id ?? 'global'), $fileName, 'local');

        $document = Document::create([
            'company_id' => $user->company_id,
            'folder_id' => $request->folder_id,
            'uploaded_by' => $user->id,
            'name' => $request->name ?? pathinfo($originalName, PATHINFO_FILENAME),
            'original_name' => $originalName,
            'description' => $request->description,
            'file_path' => $path,
            'file_type' => $extension,
            'mime_type' => $file->getMimeType(),
            'file_size' => $fileSize,
            'category' => $request->category,
            'tags' => $request->tags,
            'document_date' => $request->document_date,
        ]);

        if ($company) {
            $company->incrementStorage($fileSize);
            $company->incrementDocuments();
        }

        if ($document->folder) {
            $document->folder->incrementDocuments();
            $document->folder->updateSize();
        }

        ActivityLog::log(ActivityLog::ACTION_UPLOAD, $user, $document, "Document {$document->name} téléversé");

        return $this->success($document->load(['folder', 'uploader']), 'Document téléversé avec succès', 201);
    }

    public function show(Request $request, Document $document)
    {
        $user = $request->user();

        if (!$user->isSuperAdmin() && $document->company_id !== $user->company_id) {
            return $this->error('Document non trouvé.', 404);
        }

        $document->incrementViews();
        
        ActivityLog::log(ActivityLog::ACTION_VIEW, $user, $document, "Document {$document->name} consulté");

        return $this->success($document->load(['folder', 'uploader']));
    }

    public function update(Request $request, Document $document)
    {
        $user = $request->user();

        if (!$user->isSuperAdmin() && $document->company_id !== $user->company_id) {
            return $this->error('Document non trouvé.', 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'folder_id' => 'nullable|exists:folders,id',
            'category' => 'sometimes|in:facture,contrat,rapport,correspondance,legal,rh,autre',
            'tags' => 'nullable|array',
            'document_date' => 'nullable|date',
        ]);

        $oldValues = $document->toArray();
        $oldFolderId = $document->folder_id;

        $document->update($request->only(['name', 'description', 'folder_id', 'category', 'tags', 'document_date']));

        // Update folder counts if moved
        if ($request->has('folder_id') && $oldFolderId !== $request->folder_id) {
            if ($oldFolderId) {
                Folder::find($oldFolderId)?->decrementDocuments();
            }
            if ($request->folder_id) {
                Folder::find($request->folder_id)?->incrementDocuments();
            }
        }

        ActivityLog::log(ActivityLog::ACTION_EDIT, $user, $document, "Document {$document->name} modifié", $oldValues, $document->toArray());

        return $this->success($document->load(['folder', 'uploader']), 'Document mis à jour');
    }

    public function destroy(Request $request, Document $document)
    {
        $user = $request->user();

        if (!$user->isSuperAdmin() && $document->company_id !== $user->company_id) {
            return $this->error('Document non trouvé.', 404);
        }

        if (!$user->canDelete()) {
            return $this->error('Vous n\'avez pas la permission de supprimer ce document.', 403);
        }

        $company = $document->company;
        $fileSize = $document->file_size;

        Storage::disk('local')->delete($document->file_path);

        if ($document->folder) {
            $document->folder->decrementDocuments();
        }

        ActivityLog::log(ActivityLog::ACTION_DELETE, $user, $document, "Document {$document->name} supprimé");

        $document->delete();

        if ($company) {
            $company->decrementStorage($fileSize);
            $company->decrementDocuments();
        }

        return $this->success(null, 'Document supprimé');
    }

    public function download(Request $request, Document $document)
    {
        $user = $request->user();

        if (!$user->isSuperAdmin() && $document->company_id !== $user->company_id) {
            return $this->error('Document non trouvé.', 404);
        }

        $document->incrementDownloads();

        ActivityLog::log(ActivityLog::ACTION_DOWNLOAD, $user, $document, "Document {$document->name} téléchargé");

        return Storage::disk('local')->download($document->file_path, $document->original_name);
    }

    public function archive(Request $request, Document $document)
    {
        $user = $request->user();

        if (!$user->isSuperAdmin() && $document->company_id !== $user->company_id) {
            return $this->error('Document non trouvé.', 404);
        }

        $document->archive();

        ActivityLog::log(ActivityLog::ACTION_ARCHIVE, $user, $document, "Document {$document->name} archivé");

        return $this->success($document, 'Document archivé');
    }

    public function restore(Request $request, Document $document)
    {
        $user = $request->user();

        if (!$user->isSuperAdmin() && $document->company_id !== $user->company_id) {
            return $this->error('Document non trouvé.', 404);
        }

        $document->restore();

        return $this->success($document, 'Document restauré');
    }

    public function stats(Request $request)
    {
        $user = $request->user();
        $query = Document::query();

        if (!$user->isSuperAdmin()) {
            $query->where('company_id', $user->company_id);
        }

        $stats = [
            'total' => (clone $query)->count(),
            'active' => (clone $query)->active()->count(),
            'archived' => (clone $query)->archived()->count(),
            'total_size' => (clone $query)->sum('file_size'),
            'by_category' => [],
        ];

        $categories = ['facture', 'contrat', 'rapport', 'correspondance', 'legal', 'rh', 'autre'];
        foreach ($categories as $category) {
            $stats['by_category'][$category] = (clone $query)->byCategory($category)->count();
        }

        return $this->success($stats);
    }
}
