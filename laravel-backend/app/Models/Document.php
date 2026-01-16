<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    use HasFactory, SoftDeletes;

    const CATEGORY_FACTURE = 'facture';
    const CATEGORY_CONTRAT = 'contrat';
    const CATEGORY_RAPPORT = 'rapport';
    const CATEGORY_CORRESPONDANCE = 'correspondance';
    const CATEGORY_LEGAL = 'legal';
    const CATEGORY_RH = 'rh';
    const CATEGORY_AUTRE = 'autre';

    protected $fillable = [
        'company_id',
        'folder_id',
        'uploaded_by',
        'name',
        'original_name',
        'description',
        'file_path',
        'file_type',
        'mime_type',
        'file_size',
        'category',
        'tags',
        'metadata',
        'status',
        'version',
        'downloads_count',
        'views_count',
        'document_date',
        'expiry_date',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'tags' => 'array',
        'metadata' => 'array',
        'version' => 'integer',
        'downloads_count' => 'integer',
        'views_count' => 'integer',
        'document_date' => 'date',
        'expiry_date' => 'date',
    ];

    protected $appends = ['formatted_size', 'extension'];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function getFormattedSizeAttribute(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function getExtensionAttribute(): string
    {
        return strtoupper(pathinfo($this->original_name, PATHINFO_EXTENSION));
    }

    public function incrementDownloads(): void
    {
        $this->increment('downloads_count');
    }

    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    public function archive(): void
    {
        $this->update(['status' => 'archived']);
    }

    public function restore(): void
    {
        $this->update(['status' => 'active']);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeArchived($query)
    {
        return $query->where('status', 'archived');
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeSearch($query, string $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('name', 'like', "%{$term}%")
              ->orWhere('description', 'like', "%{$term}%")
              ->orWhere('original_name', 'like', "%{$term}%");
        });
    }
}
