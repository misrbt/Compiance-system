<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetCurrentPortal
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $portal = null): Response
    {
        // If portal is specified in middleware, use it
        if ($portal) {
            $request->session()->put('current_portal', $portal);
        }

        // Share current portal with all Inertia views
        $currentPortal = $request->session()->get('current_portal', 'amla');

        \Inertia\Inertia::share('currentPortal', $currentPortal);

        return $next($request);
    }
}
