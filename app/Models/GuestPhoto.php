<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class GuestPhoto extends Model
{
    protected $fillable = [
        'invitee_id',
        'guest_name',
        'path',
        'original_filename',
        'caption',
        'approved',
    ];

    protected $casts = [
        'approved' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::deleting(function (GuestPhoto $photo) {
            if ($photo->path) {
                Storage::disk('public')->delete($photo->path);
            }
        });
    }

    public function invitee(): BelongsTo
    {
        return $this->belongsTo(Invitee::class);
    }

    public function scopeApproved($query)
    {
        return $query->where('approved', true);
    }

    public function getUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->path);
    }

    public function getDisplayNameAttribute(): string
    {
        if ($this->invitee) {
            return $this->invitee->name;
        }

        return $this->guest_name ?: 'A guest';
    }
}
