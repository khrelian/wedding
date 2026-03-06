<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class PortFixServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Fix PORT environment variable to ensure it's an integer
        if (isset($_ENV['PORT']) && is_string($_ENV['PORT'])) {
            $_ENV['PORT'] = (int) $_ENV['PORT'];
            putenv('PORT=' . $_ENV['PORT']);
        }
        
        if (isset($_SERVER['PORT']) && is_string($_SERVER['PORT'])) {
            $_SERVER['PORT'] = (int) $_SERVER['PORT'];
        }
    }

    public function boot()
    {
        //
    }
}
