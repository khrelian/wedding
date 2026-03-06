<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\URL;

class Invitee extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'token',
        'party_size',
        'rsvp_submitted',
        'rsvp_status',
        'notes',
    ];

    protected $casts = [
        'rsvp_submitted' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        // Automatically generate a unique token when creating an invitee
        static::creating(function ($invitee) {
            if (empty($invitee->token)) {
                $invitee->token = Str::random(32);
            }
        });
    }

    /**
     * Get the signed invitation URL (personalized welcome page)
     */
    public function getSignedInvitationUrl(): string
    {
        return URL::temporarySignedRoute(
            'invitation.show',
            now()->addMonths(6), // Valid for 6 months
            ['token' => $this->token]
        );
    }

    /**
     * Get the signed RSVP URL for this invitee
     */
    public function getSignedRsvpUrl(): string
    {
        return URL::temporarySignedRoute(
            'rsvp.guest',
            now()->addMonths(6), // Valid for 6 months
            ['token' => $this->token]
        );
    }

    /**
     * Get the RSVP response if submitted
     */
    public function rsvp()
    {
        return $this->hasOne(Rsvp::class, 'invitee_id');
    }
}

