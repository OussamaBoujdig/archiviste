<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\FolderController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/password', [AuthController::class, 'changePassword']);

    // Dashboard
    Route::get('/dashboard/super-admin', [DashboardController::class, 'superAdmin']);
    Route::get('/dashboard/client-admin', [DashboardController::class, 'clientAdmin']);

    // Companies (Super Admin only)
    Route::middleware('role:super_admin')->group(function () {
        Route::get('/companies/stats', [CompanyController::class, 'stats']);
        Route::apiResource('companies', CompanyController::class);
        Route::post('/companies/{company}/suspend', [CompanyController::class, 'suspend']);
        Route::post('/companies/{company}/activate', [CompanyController::class, 'activate']);
    });

    // Documents
    Route::get('/documents/stats', [DocumentController::class, 'stats']);
    Route::get('/documents/{document}/download', [DocumentController::class, 'download']);
    Route::post('/documents/{document}/archive', [DocumentController::class, 'archive']);
    Route::post('/documents/{document}/restore', [DocumentController::class, 'restore']);
    Route::apiResource('documents', DocumentController::class);

    // Folders
    Route::get('/folders/tree', [FolderController::class, 'tree']);
    Route::apiResource('folders', FolderController::class);

    // Users
    Route::middleware('role:super_admin,client_admin')->group(function () {
        Route::post('/users/{user}/reset-password', [UserController::class, 'resetPassword']);
        Route::apiResource('users', UserController::class);
    });

    // Activity Logs
    Route::get('/activity-logs/stats', [ActivityLogController::class, 'stats']);
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);
    Route::get('/activity-logs/{activityLog}', [ActivityLogController::class, 'show']);
});
