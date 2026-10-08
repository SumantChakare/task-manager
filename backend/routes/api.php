<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Authenticated via Sanctum Bearer Token)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Current authenticated user session
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin endpoint to retrieve users list for task ownership filter/assignment
    Route::get('/users', function (Request $request) {
        if (! $request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden: Only administrators can view user directory.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => User::select('id', 'name', 'email', 'role')->get(),
        ]);
    });

    // Task CRUD operations with RBAC & ownership enforcement
    Route::apiResource('tasks', TaskController::class);
});