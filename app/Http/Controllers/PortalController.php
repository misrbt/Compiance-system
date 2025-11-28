<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PortalController extends Controller
{
    public function index()
    {
        return Inertia::render('Portal/SelectPortal', [
            'portals' => [
                [
                    'id' => 'amla',
                    'name' => 'AMLA Report',
                    'description' => 'Anti-Money Laundering Council Reporting System',
                    'icon' => 'shield',
                    'color' => 'blue',
                    'route' => '/dashboard',
                    'enabled' => true,
                ],
                // Future portals can be added here
                // [
                //     'id' => 'kyc',
                //     'name' => 'KYC Portal',
                //     'description' => 'Know Your Customer Compliance Portal',
                //     'icon' => 'users',
                //     'color' => 'green',
                //     'route' => '/kyc/dashboard',
                //     'enabled' => false,
                // ],
            ],
        ]);
    }

    public function setPortal(Request $request, $portal)
    {
        $request->session()->put('current_portal', $portal);

        // Redirect based on portal
        $routes = [
            'amla' => '/dashboard',
            // Add more portal routes here
        ];

        return redirect($routes[$portal] ?? '/portals');
    }
}
