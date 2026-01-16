<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Folder;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class FolderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Folder::query();

        if (!$user->isSuperAdmin()) {
            $query->where('company_id', $user->company_id);
        }

        if ($parentId = $request->get('parent_id')) {
            $query->where('parent_id', $parentId);
        } else {
            $query->whereNull('parent_id');
        }

        $folders = $query->with(['creator', 'children'])
            ->withCount('documents')
            ->orderBy('name')
            ->get();

        return $this->success($folders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:folders,id',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50',
        ]);

        $user = $request->user();

        $folder = Folder::create([
            'company_id' => $user->company_id,
            'created_by' => $user->id,
            'parent_id' => $request->parent_id,
            'name' => $request->name,
            'description' => $request->description,
            'color' => $request->color ?? '#3b82f6',
            'icon' => $request->icon ?? 'folder',
        ]);

        ActivityLog::log(ActivityLog::ACTION_CREATE_FOLDER, $user, $folder, "Dossier {$folder->name} créé");

        return $this->success($folder->load('creator'), 'Dossier créé avec succès', 201);
    }

    public function show(Request $request, Folder $folder)
    {
        $user = $request->user();

        if (!$user->isSuperAdmin() && $folder->company_id !== $user->company_id) {
            return $this->error('Dossier non trouvé.', 404);
        }

        $folder->load(['creator', 'children', 'documents.uploader']);
        $folder->loadCount('documents');

        return $this->success($folder);
    }

    public function update(Request $request, Folder $folder)
    {
        $user = $request->user();

        if (!$user->isSuperAdmin() && $folder->company_id !== $user->company_id) {
            return $this->error('Dossier non trouvé.', 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:folders,id',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50',
        ]);

        // Prevent moving folder to itself or its children
        if ($request->has('parent_id') && $request->parent_id) {
            if ($request->parent_id == $folder->id) {
                return $this->error('Un dossier ne peut pas être son propre parent.', 422);
            }
        }

        $oldValues = $folder->toArray();
        $folder->update($request->only(['name', 'description', 'parent_id', 'color', 'icon']));

        ActivityLog::log(ActivityLog::ACTION_EDIT, $user, $folder, "Dossier {$folder->name} modifié", $oldValues, $folder->toArray());

        return $this->success($folder->load('creator'), 'Dossier mis à jour');
    }

    public function destroy(Request $request, Folder $folder)
    {
        $user = $request->user();

        if (!$user->isSuperAdmin() && $folder->company_id !== $user->company_id) {
            return $this->error('Dossier non trouvé.', 404);
        }

        if (!$user->canDelete()) {
            return $this->error('Vous n\'avez pas la permission de supprimer ce dossier.', 403);
        }

        // Check if folder has documents
        if ($folder->documents()->count() > 0) {
            return $this->error('Le dossier contient des documents. Veuillez d\'abord les supprimer ou les déplacer.', 422);
        }

        // Check if folder has children
        if ($folder->children()->count() > 0) {
            return $this->error('Le dossier contient des sous-dossiers. Veuillez d\'abord les supprimer.', 422);
        }

        ActivityLog::log(ActivityLog::ACTION_DELETE_FOLDER, $user, $folder, "Dossier {$folder->name} supprimé");

        $folder->delete();

        return $this->success(null, 'Dossier supprimé');
    }

    public function tree(Request $request)
    {
        $user = $request->user();
        $query = Folder::query();

        if (!$user->isSuperAdmin()) {
            $query->where('company_id', $user->company_id);
        }

        $folders = $query->whereNull('parent_id')
            ->with(['children' => function ($q) {
                $q->with('children');
            }])
            ->withCount('documents')
            ->orderBy('name')
            ->get();

        return $this->success($folders);
    }
}
