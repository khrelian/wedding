<?php

namespace App\Http\Controllers;

use App\Models\Rsvp;
use App\Models\Invitee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RsvpController extends Controller
{
    public function index(): Response
    {
        $rsvps = Rsvp::with(['user', 'invitee'])
            ->latest()
            ->get()
            ->map(function ($rsvp) {
                return [
                    'id' => $rsvp->id,
                    'guest_name' => $rsvp->invitee ? $rsvp->invitee->name : $rsvp->user->name,
                    'email' => $rsvp->invitee ? $rsvp->invitee->email : $rsvp->user->email,
                    'attendance' => $rsvp->attendance,
                    'song_request' => $rsvp->song_request,
                    'special_message' => $rsvp->special_message,
                    'submitted_at' => $rsvp->created_at->format('M d, Y h:i A'),
                ];
            });

        $stats = [
            'total' => $rsvps->count(),
            'attending' => $rsvps->where('attendance', 'yes')->count(),
            'not_attending' => $rsvps->where('attendance', 'no')->count(),
        ];

        return Inertia::render('RsvpManagement', [
            'rsvps' => $rsvps,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'attendance' => 'required|in:yes,no',
            'song_request' => 'nullable|string|max:255',
            'special_message' => 'nullable|string',
        ]);

        $rsvp = Rsvp::updateOrCreate(
            ['user_id' => $request->user()->id],
            $validated
        );

        return redirect()->back()->with('success', 'RSVP submitted successfully!');
    }

    public function show(): Response
    {
        $rsvp = Rsvp::where('user_id', auth()->id())->first();

        return Inertia::render('RSVP', [
            'existingRsvp' => $rsvp,
            'guestMode' => false,
        ]);
    }

    /**
     * Show RSVP form for guest invitees (signed URL)
     */
    public function showGuest(Request $request, string $token): Response
    {
        // Find invitee by token
        $invitee = Invitee::where('token', $token)->firstOrFail();

        // Get existing RSVP if any
        $rsvp = Rsvp::where('invitee_id', $invitee->id)->first();

        return Inertia::render('GuestRSVP', [
            'invitee' => [
                'id' => $invitee->id,
                'name' => $invitee->name,
                'party_size' => $invitee->party_size,
            ],
            'existingRsvp' => $rsvp,
            'guestMode' => true,
        ]);
    }

    /**
     * Store RSVP for guest invitees
     */
    public function storeGuest(Request $request, string $token)
    {
        $invitee = Invitee::where('token', $token)->firstOrFail();

        $validated = $request->validate([
            'attendance' => 'required|in:yes,no',
            'song_request' => 'nullable|string|max:255',
            'special_message' => 'nullable|string',
        ]);

        $rsvp = Rsvp::updateOrCreate(
            ['invitee_id' => $invitee->id],
            $validated
        );

        // Update invitee status
        $invitee->update([
            'rsvp_submitted' => true,
            'rsvp_status' => $validated['attendance'],
        ]);

        return redirect()->back()->with('success', 'Thank you! Your RSVP has been submitted successfully!');
    }
}

