<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rsvp extends Model
{
    protected $fillable = [
        'user_id',
        'invitee_id',
        'attendance',
        'song_request',
        'special_message',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function invitee(): BelongsTo
    {
        return $this->belongsTo(Invitee::class);
    }
}

