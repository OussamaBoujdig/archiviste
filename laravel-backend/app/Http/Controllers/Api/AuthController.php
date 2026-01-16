<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        if ($user->status !== 'active') {
            return $this->error('Votre compte est désactivé.', 403);
        }

        $user->updateLastLogin();

        ActivityLog::log(ActivityLog::ACTION_LOGIN, $user, null, 'Connexion réussie');

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->success([
            'user' => $this->formatUser($user),
            'token' => $token,
        ], 'Connexion réussie');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'company_id' => 'nullable|exists:companies,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'company_id' => $request->company_id,
            'role' => $request->company_id ? User::ROLE_CLIENT_USER : User::ROLE_SUPER_ADMIN,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        ActivityLog::log('user_created', $user, $user, 'Nouveau compte créé');

        return $this->success([
            'user' => $this->formatUser($user),
            'token' => $token,
        ], 'Inscription réussie', 201);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        
        ActivityLog::log(ActivityLog::ACTION_LOGOUT, $user, null, 'Déconnexion');

        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'Déconnexion réussie');
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('company');

        return $this->success($this->formatUser($user));
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'department' => 'nullable|string|max:100',
        ]);

        $user->update($request->only(['name', 'email', 'phone', 'department']));

        return $this->success($this->formatUser($user), 'Profil mis à jour');
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return $this->error('Le mot de passe actuel est incorrect.', 422);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        ActivityLog::log('password_changed', $user, null, 'Mot de passe modifié');

        return $this->success(null, 'Mot de passe modifié avec succès');
    }

    protected function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar,
            'role' => $user->role,
            'status' => $user->status,
            'phone' => $user->phone,
            'department' => $user->department,
            'initials' => $user->initials,
            'is_admin' => $user->is_admin,
            'company_id' => $user->company_id,
            'company' => $user->company ? [
                'id' => $user->company->id,
                'name' => $user->company->name,
                'plan' => $user->company->plan,
            ] : null,
            'last_login_at' => $user->last_login_at?->toISOString(),
            'created_at' => $user->created_at->toISOString(),
        ];
    }
}
