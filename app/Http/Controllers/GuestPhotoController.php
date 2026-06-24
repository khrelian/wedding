<?php

namespace App\Http\Controllers;

use App\Models\GuestPhoto;
use App\Models\Invitee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class GuestPhotoController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('GuestPhotos', [
            'invitee' => null,
            'recentUploads' => $this->recentUploads(),
        ]);
    }

    public function showGuest(string $token): Response
    {
        $invitee = Invitee::where('token', $token)->firstOrFail();

        return Inertia::render('GuestPhotos', [
            'invitee' => [
                'id' => $invitee->id,
                'token' => $invitee->token,
                'name' => $invitee->name,
            ],
            'recentUploads' => $this->recentUploads(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'photo' => ['required', 'image', 'mimes:jpeg,jpg,png,webp,heic,heif', 'max:' . $this->maxUploadKilobytes()],
            'guest_name' => ['required', 'string', 'max:120'],
            'caption' => ['nullable', 'string', 'max:255'],
        ]);

        $this->createPhoto(
            $request->file('photo'),
            $validated['caption'] ?? null,
            null,
            $validated['guest_name'],
        );

        return redirect()->back()->with('success', 'Thank you! Your photo has been shared.');
    }

    public function storeGuest(Request $request, string $token): RedirectResponse
    {
        $invitee = Invitee::where('token', $token)->firstOrFail();

        $validated = $request->validate([
            'photo' => ['required', 'image', 'mimes:jpeg,jpg,png,webp,heic,heif', 'max:' . $this->maxUploadKilobytes()],
            'caption' => ['nullable', 'string', 'max:255'],
        ]);

        $this->createPhoto(
            $request->file('photo'),
            $validated['caption'] ?? null,
            $invitee,
            $invitee->name,
        );

        return redirect()->back()->with('success', 'Thank you! Your photo has been shared.');
    }

    public function slideshow(): Response
    {
        return Inertia::render('PhotoSlideshow', [
            'photos' => $this->slideshowPayload(),
            'upload_url' => route('photos.share'),
        ]);
    }

    public function slideshowQrCode(): HttpResponse
    {
        $url = route('photos.share');

        $qrCode = QrCode::format('svg')
            ->size(280)
            ->margin(1)
            ->errorCorrection('H')
            ->generate($url);

        return response($qrCode, 200)
            ->header('Content-Type', 'image/svg+xml');
    }

    public function slideshowPhotos(): JsonResponse
    {
        return response()->json([
            'photos' => $this->slideshowPayload(),
        ]);
    }

    public function index(): Response
    {
        $photos = GuestPhoto::with('invitee')
            ->latest()
            ->get()
            ->map(fn (GuestPhoto $photo) => $this->formatPhoto($photo));

        $stats = [
            'total' => $photos->count(),
            'approved' => $photos->where('approved', true)->count(),
            'pending' => $photos->where('approved', false)->count(),
        ];

        return Inertia::render('GuestPhotoManagement', [
            'photos' => $photos,
            'stats' => $stats,
        ]);
    }

    public function approve(GuestPhoto $guestPhoto): RedirectResponse
    {
        $guestPhoto->update(['approved' => true]);

        return redirect()->back()->with('success', 'Photo approved.');
    }

    public function reject(GuestPhoto $guestPhoto): RedirectResponse
    {
        $guestPhoto->update(['approved' => false]);

        return redirect()->back()->with('success', 'Photo hidden from the slideshow.');
    }

    public function destroy(GuestPhoto $guestPhoto): RedirectResponse
    {
        $guestPhoto->delete();

        return redirect()->back()->with('success', 'Photo deleted.');
    }

    private function createPhoto($file, ?string $caption, ?Invitee $invitee, ?string $guestName): GuestPhoto
    {
        $folder = $invitee ? "guest-photos/invitee-{$invitee->id}" : 'guest-photos/public';
        $path = $file->store($folder, 'public');

        return GuestPhoto::create([
            'invitee_id' => $invitee?->id,
            'guest_name' => $guestName,
            'path' => $path,
            'original_filename' => $file->getClientOriginalName(),
            'caption' => $caption,
            'approved' => ! config('wedding.guest_photos.require_approval', false),
        ]);
    }

    private function recentUploads(): array
    {
        return GuestPhoto::approved()
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn (GuestPhoto $photo) => $this->formatPhoto($photo))
            ->all();
    }

    private function slideshowPayload(): array
    {
        return GuestPhoto::approved()
            ->latest()
            ->get()
            ->map(fn (GuestPhoto $photo) => $this->formatPhoto($photo))
            ->all();
    }

    private function formatPhoto(GuestPhoto $photo): array
    {
        return [
            'id' => $photo->id,
            'url' => $photo->url,
            'caption' => $photo->caption,
            'guest_name' => $photo->display_name,
            'approved' => $photo->approved,
            'uploaded_at' => $photo->created_at->format('M d, Y h:i A'),
        ];
    }

    private function maxUploadKilobytes(): int
    {
        return (int) config('wedding.guest_photos.max_upload_mb', 10) * 1024;
    }
}
