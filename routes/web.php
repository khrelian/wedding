<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RsvpController;
use App\Http\Controllers\InviteeController;
use App\Http\Controllers\GuestPhotoController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Redirect dashboard to invitees page
Route::get('/dashboard', function () {
    return redirect()->route('invitees.index');
})->middleware(['auth', 'verified'])->name('dashboard');

// Guest Routes (signed URLs - no authentication required)
// Personalized welcome page for invitees
Route::get('/invitation/{token}', [InviteeController::class, 'showInvitation'])->name('invitation.show');
// Guest RSVP Routes
Route::get('/rsvp/guest/{token}', [RsvpController::class, 'showGuest'])->name('rsvp.guest');
Route::post('/rsvp/guest/{token}', [RsvpController::class, 'storeGuest'])->name('rsvp.guest.store');

// Guest photo sharing
Route::get('/photos', [GuestPhotoController::class, 'show'])->name('photos.share');
Route::post('/photos', [GuestPhotoController::class, 'store'])->middleware('throttle:20,1')->name('photos.share.store');
Route::get('/photos/guest/{token}', [GuestPhotoController::class, 'showGuest'])->name('photos.guest');
Route::post('/photos/guest/{token}', [GuestPhotoController::class, 'storeGuest'])->middleware('throttle:20,1')->name('photos.guest.store');
Route::get('/slideshow', [GuestPhotoController::class, 'slideshow'])->name('photos.slideshow');
Route::get('/slideshow/qrcode', [GuestPhotoController::class, 'slideshowQrCode'])->name('photos.slideshow.qrcode');
Route::get('/slideshow/photos', [GuestPhotoController::class, 'slideshowPhotos'])->name('photos.slideshow.data');

Route::middleware(['auth', 'verified'])->group(function () {
    // RSVP Form (Admin)
    Route::get('/rsvp', [RsvpController::class, 'show'])->name('rsvp');
    Route::post('/rsvp', [RsvpController::class, 'store'])->name('rsvp.store');
    
    // RSVP Management (View all RSVPs)
    Route::get('/rsvp-management', [RsvpController::class, 'index'])->name('rsvp.management');
    
    // Invitee Management
    Route::get('/invitees', [InviteeController::class, 'index'])->name('invitees.index');
    Route::post('/invitees', [InviteeController::class, 'store'])->name('invitees.store');
    Route::patch('/invitees/{invitee}', [InviteeController::class, 'update'])->name('invitees.update');
    Route::delete('/invitees/{invitee}', [InviteeController::class, 'destroy'])->name('invitees.destroy');
    Route::get('/invitees/{invitee}/qrcode', [InviteeController::class, 'getQrCode'])->name('invitees.qrcode');
    Route::get('/invitees/{invitee}/qrcode/download', [InviteeController::class, 'downloadQrCode'])->name('invitees.qrcode.download');

    // Guest photo moderation
    Route::get('/guest-photos', [GuestPhotoController::class, 'index'])->name('guest-photos.index');
    Route::patch('/guest-photos/{guestPhoto}/approve', [GuestPhotoController::class, 'approve'])->name('guest-photos.approve');
    Route::delete('/guest-photos/{guestPhoto}', [GuestPhotoController::class, 'destroy'])->name('guest-photos.destroy');
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
