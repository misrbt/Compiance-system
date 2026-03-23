<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\PreventBackHistory;
use App\Http\Middleware\PreventLoginCaching;
use App\Http\Middleware\PreventPageCaching;
use App\Http\Middleware\SetCurrentPortal;
use App\Http\Middleware\TrustProxies;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->use([
            TrustProxies::class,
        ]);

        $middleware->web(append: [
            HandleInertiaRequests::class,
            PreventPageCaching::class,
        ]);

        $middleware->alias([
            'prevent.back' => PreventBackHistory::class,
            'prevent.login.cache' => PreventLoginCaching::class,
            'portal' => SetCurrentPortal::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
