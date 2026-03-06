<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Fix PORT environment variable to be an integer (Railway compatibility)
if (isset($_ENV['PORT']) && is_string($_ENV['PORT'])) {
    $_ENV['PORT'] = (int) $_ENV['PORT'];
    putenv('PORT=' . $_ENV['PORT']);
}
if (isset($_SERVER['PORT']) && is_string($_SERVER['PORT'])) {
    $_SERVER['PORT'] = (int) $_SERVER['PORT'];
}

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
