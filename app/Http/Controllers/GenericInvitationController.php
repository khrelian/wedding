<?php

namespace App\Http\Controllers;

use App\Models\Invitee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class GenericInvitationController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('GenericInvitation');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'required_without:phone', 'email', 'max:255'],
            'phone' => ['nullable', 'required_without:email', 'string', 'max:30'],
            'party_size' => ['required', 'integer', 'min:1', 'max:10'],
            'attendance' => ['required', 'in:yes,no'],
            'song_request' => ['nullable', 'string', 'max:255'],
            'special_message' => ['nullable', 'string', 'max:2000'],
        ]);

        DB::transaction(function () use ($validated) {
            $invitee = Invitee::create([
                'name' => $validated['name'],
                'email' => $validated['email'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'party_size' => $validated['party_size'],
            ]);

            $invitee->rsvp()->create([
                'attendance' => $validated['attendance'],
                'song_request' => $validated['song_request'] ?? null,
                'special_message' => $validated['special_message'] ?? null,
            ]);

            $invitee->update([
                'rsvp_submitted' => true,
                'rsvp_status' => $validated['attendance'],
            ]);
        });

        return redirect()
            ->route('generic-invitation.show')
            ->with('success', 'Thank you! Your information and RSVP have been received.');
    }

    public function qrCode()
    {
        $qrCode = QrCode::format('svg')
            ->size(320)
            ->margin(1)
            ->errorCorrection('H')
            ->generate(url('/'));

        return response($qrCode, 200)->header('Content-Type', 'image/svg+xml');
    }

    public function downloadQrCode()
    {
        $qrCode = QrCode::format('png')
            ->size(800)
            ->margin(2)
            ->errorCorrection('H')
            ->generate(url('/'));

        return response($qrCode, 200)
            ->header('Content-Type', 'image/png')
            ->header('Content-Disposition', 'attachment; filename="generic-anniversary-rsvp-qr.png"');
    }
}
