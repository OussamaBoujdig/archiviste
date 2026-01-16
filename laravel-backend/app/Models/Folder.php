<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Folder extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'company_id',
        'parent_id',
        'created_by',
        'name',
        'description',
        'color',
        'icon',
        'documents_count',
        'size',
        'permissions',
    ];

    protected $casts = [
        'documents_count' => 'integer',
        'size' => 'integer',
        'permissions' => 'array',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Folder::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Folder::class, 'parent_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function incrementDocuments(): void
    {
        $this->increment('documents_count');
    }

    public function decrementDocuments(): void
    {
        $this->decrement('documents_count');
    }

    public function updateSize(): void
    {
        $this->update([
            'size' => $this->documents()->sum('file_size')
        ]);
    }

    public function getPath(): string
    {
        $path = [$this->name];
        $parent = $this->parent;
        
        while ($parent) {
            array_unshift($path, $parent->name);
            $parent = $parent->parent;
        }
        
        return implode(' / ', $path);
    }
}
