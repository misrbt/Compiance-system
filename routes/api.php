<?php

use App\Http\Controllers\Api\RegisterController;
use Illuminate\Support\Facades\Route;

// API Registration Route
Route::post('/register', [RegisterController::class, 'store']);
