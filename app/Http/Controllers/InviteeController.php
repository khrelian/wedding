<?php

namespace App\Http\Controllers;

use App\Models\Invitee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class InviteeController extends Controller
{
    /**
     * Show personalized invitation/welcome page for a guest
     */
    public function showInvitation(Request $request, string $token): Response
    {
        // Find invitee by token
        $invitee = Invitee::where('token', $token)->firstOrFail();

        return Inertia::render('PersonalizedWelcome', [
            'invitee' => [
                'id' => $invitee->id,
                'name' => $invitee->name,
                'party_size' => $invitee->party_size,
                'token' => $invitee->token,
                'rsvp_url' => route('rsvp.guest', ['token' => $invitee->token]),
            ],
        ]);
    }

    /**
     * Display a listing of invitees (Admin Page)
     */
    public function index(): Response
    {
        $invitees = Invitee::latest()
            ->get()
            ->map(function ($invitee) {
                return [
                    'id' => $invitee->id,
                    'name' => $invitee->name,
                    'email' => $invitee->email,
                    'phone' => $invitee->phone,
                    'party_size' => $invitee->party_size,
                    'rsvp_submitted' => $invitee->rsvp_submitted,
                    'rsvp_status' => $invitee->rsvp_status,
                    'notes' => $invitee->notes,
                    'rsvp_url' => $invitee->getSignedRsvpUrl(),
                    'invitation_url' => $invitee->getSignedInvitationUrl(),
                    'created_at' => $invitee->created_at->format('M d, Y'),
                ];
            });

        $stats = [
            'total_invitees' => $invitees->count(),
            'total_invited_people' => $invitees->sum('party_size'),
            'rsvp_submitted' => $invitees->where('rsvp_submitted', true)->count(),
            'attending' => $invitees->where('rsvp_status', 'yes')->count(),
            'not_attending' => $invitees->where('rsvp_status', 'no')->count(),
        ];

        return Inertia::render('InviteeManagement', [
            'invitees' => $invitees,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created invitee
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'party_size' => 'required|integer|min:1|max:10',
            'notes' => 'nullable|string',
        ]);

        $invitee = Invitee::create($validated);

        return redirect()->back()->with('success', 'Invitee added successfully!');
    }

    /**
     * Update the specified invitee
     */
    public function update(Request $request, Invitee $invitee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'party_size' => 'required|integer|min:1|max:10',
            'notes' => 'nullable|string',
        ]);

        $invitee->update($validated);

        return redirect()->back()->with('success', 'Invitee updated successfully!');
    }

    /**
     * Remove the specified invitee
     */
    public function destroy(Invitee $invitee)
    {
        $invitee->delete();

        return redirect()->back()->with('success', 'Invitee deleted successfully!');
    }

    /**
     * Generate and download QR code for an invitee
     */
    public function downloadQrCode(Invitee $invitee)
    {
        $url = $invitee->getSignedInvitationUrl();
        
        $qrCode = QrCode::format('png')
            ->size(400)
            ->margin(2)
            ->errorCorrection('H')
            ->generate($url);

        $filename = 'qrcode-' . str($invitee->name)->slug() . '.png';

        return response($qrCode, 200)
            ->header('Content-Type', 'image/png')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    /**
     * Get QR code inline (for display in admin panel)
     */
    public function getQrCode(Invitee $invitee)
    {
        $url = $invitee->getSignedInvitationUrl();
        
        $qrCode = QrCode::format('svg')
            ->size(300)
            ->margin(1)
            ->errorCorrection('H')
            ->generate($url);

        return response($qrCode, 200)
            ->header('Content-Type', 'image/svg+xml');
    }
}
