<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class GiveawayController extends Controller
{
    public function chibi(): Response
    {
        return Inertia::render('ChibiGiveaway');
    }
}
