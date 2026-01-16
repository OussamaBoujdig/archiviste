<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    const ROLE_SUPER_ADMIN = 'super_admin';
    const ROLE_CLIENT_ADMIN = 'client_admin';
    const ROLE_CLIENT_USER = 'client_user';
    const ROLE_READ_ONLY = 'read_only';

    protected $fillable = [
        'company_id',
        'name',
        'email',
        'password',
        'avatar',
        'role',
        'status',
        'phone',
        'department',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected $appends = ['initials', 'is_admin'];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'uploaded_by');
    }

    public function folders(): HasMany
    {
        return $this->hasMany(Folder::class, 'created_by');
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function getInitialsAttribute(): string
    {
        $words = explode(' ', $this->name);
        $initials = '';
        foreach (array_slice($words, 0, 2) as $word) {
            $initials .= strtoupper(substr($word, 0, 1));
        }
        return $initials;
    }

    public function getIsAdminAttribute(): bool
    {
        return in_array($this->role, [self::ROLE_SUPER_ADMIN, self::ROLE_CLIENT_ADMIN]);
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === self::ROLE_SUPER_ADMIN;
    }

    public function isClientAdmin(): bool
    {
        return $this->role === self::ROLE_CLIENT_ADMIN;
    }

    public function isClientUser(): bool
    {
        return $this->role === self::ROLE_CLIENT_USER;
    }

    public function isReadOnly(): bool
    {
        return $this->role === self::ROLE_READ_ONLY;
    }

    public function canManageUsers(): bool
    {
        return in_array($this->role, [self::ROLE_SUPER_ADMIN, self::ROLE_CLIENT_ADMIN]);
    }

    public function canUpload(): bool
    {
        return in_array($this->role, [self::ROLE_SUPER_ADMIN, self::ROLE_CLIENT_ADMIN, self::ROLE_CLIENT_USER]);
    }

    public function canDelete(): bool
    {
        return in_array($this->role, [self::ROLE_SUPER_ADMIN, self::ROLE_CLIENT_ADMIN]);
    }

    public function updateLastLogin(): void
    {
        $this->update(['last_login_at' => now()]);
    }
}
