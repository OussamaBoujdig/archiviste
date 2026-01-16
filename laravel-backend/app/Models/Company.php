<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'logo',
        'plan',
        'status',
        'storage_used',
        'storage_limit',
        'users_count',
        'users_limit',
        'documents_count',
        'subscription_start',
        'subscription_end',
        'monthly_revenue',
    ];

    protected $casts = [
        'storage_used' => 'integer',
        'storage_limit' => 'integer',
        'users_count' => 'integer',
        'users_limit' => 'integer',
        'documents_count' => 'integer',
        'monthly_revenue' => 'decimal:2',
        'subscription_start' => 'date',
        'subscription_end' => 'date',
    ];

    protected $appends = ['storage_percentage', 'initials'];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function folders(): HasMany
    {
        return $this->hasMany(Folder::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function getStoragePercentageAttribute(): float
    {
        if ($this->storage_limit <= 0) return 0;
        return round(($this->storage_used / $this->storage_limit) * 100, 2);
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

    public function incrementStorage(int $bytes): void
    {
        $this->increment('storage_used', $bytes);
    }

    public function decrementStorage(int $bytes): void
    {
        $this->decrement('storage_used', max(0, $bytes));
    }

    public function incrementDocuments(): void
    {
        $this->increment('documents_count');
    }

    public function decrementDocuments(): void
    {
        $this->decrement('documents_count');
    }

    public function canAddUser(): bool
    {
        return $this->users_count < $this->users_limit;
    }

    public function canUpload(int $fileSize): bool
    {
        return ($this->storage_used + $fileSize) <= $this->storage_limit;
    }
}
