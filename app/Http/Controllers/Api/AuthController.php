<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    /**
     * Authenticate via centralized auth API.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $authApiUrl = config('services.central_auth.url', 'http://127.0.0.1:8001/api');

        try {
            $response = Http::timeout(10)->post("{$authApiUrl}/auth/login", [
                'login' => $request->input('email'),
                'password' => $request->input('password'),
                'system_slug' => 'amla_report',
            ]);

            if ($response->successful() && $response->json('success')) {
                return response()->json($response->json());
            }

            return response()->json([
                'success' => false,
                'message' => $response->json('message', 'The provided credentials are incorrect.'),
            ], $response->status());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication service is unavailable.',
            ], 503);
        }
    }

    /**
     * Revoke token via centralized auth API.
     */
    public function logout(Request $request): JsonResponse
    {
        $authApiUrl = config('services.central_auth.url', 'http://127.0.0.1:8001/api');
        $token = $request->bearerToken();

        if ($token) {
            try {
                Http::timeout(5)
                    ->withToken($token)
                    ->post("{$authApiUrl}/auth/logout");
            } catch (\Exception $e) {
                // Ignore
            }
        }

        // Also revoke local Sanctum token if exists
        if ($request->user()?->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }

    /**
     * Return the authenticated user via centralized auth API.
     */
    public function me(Request $request): JsonResponse
    {
        $authApiUrl = config('services.central_auth.url', 'http://127.0.0.1:8001/api');
        $token = $request->bearerToken();

        if ($token) {
            try {
                $response = Http::timeout(5)
                    ->withToken($token)
                    ->get("{$authApiUrl}/auth/profile");

                if ($response->successful()) {
                    return response()->json($response->json());
                }
            } catch (\Exception $e) {
                // Fall through
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'Unauthenticated.',
        ], 401);
    }
}
