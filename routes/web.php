<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RsvpController;
use App\Http\Controllers\InviteeController;
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
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
