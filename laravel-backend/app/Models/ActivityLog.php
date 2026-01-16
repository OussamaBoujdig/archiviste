<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    const ACTION_LOGIN = 'login';
    const ACTION_LOGOUT = 'logout';
    const ACTION_UPLOAD = 'upload';
    const ACTION_DOWNLOAD = 'download';
    const ACTION_VIEW = 'view';
    const ACTION_EDIT = 'edit';
    const ACTION_DELETE = 'delete';
    const ACTION_CREATE_FOLDER = 'create_folder';
    const ACTION_DELETE_FOLDER = 'delete_folder';
    const ACTION_MOVE = 'move';
    const ACTION_SHARE = 'share';
    const ACTION_ARCHIVE = 'archive';

    protected $fillable = [
        'company_id',
        'user_id',
        'user_name',
        'action',
        'entity_type',
        'entity_id',
        'entity_name',
        'description',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function log(
        string $action,
        ?User $user = null,
        ?Model $entity = null,
        ?string $description = null,
        ?array $oldValues = null,
        ?array $newValues = null
    ): self {
        return self::create([
            'company_id' => $user?->company_id,
            'user_id' => $user?->id,
            'user_name' => $user?->name,
            'action' => $action,
            'entity_type' => $entity ? class_basename($entity) : null,
            'entity_id' => $entity?->id,
            'entity_name' => $entity?->name ?? $entity?->title ?? null,
            'description' => $description,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function getActionLabelAttribute(): string
    {
        $labels = [
            'login' => 'Connexion',
            'logout' => 'Déconnexion',
            'upload' => 'Téléversement',
            'download' => 'Téléchargement',
            'view' => 'Consultation',
            'edit' => 'Modification',
            'delete' => 'Suppression',
            'create_folder' => 'Création dossier',
            'delete_folder' => 'Suppression dossier',
            'move' => 'Déplacement',
            'share' => 'Partage',
            'archive' => 'Archivage',
        ];

        return $labels[$this->action] ?? $this->action;
    }

    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }
}
