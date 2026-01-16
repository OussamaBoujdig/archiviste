<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = User::query();

        if ($user->isSuperAdmin()) {
            if ($companyId = $request->get('company_id')) {
                $query->where('company_id', $companyId);
            }
        } else {
            $query->where('company_id', $user->company_id);
        }

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role = $request->get('role')) {
            $query->where('role', $role);
        }

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $users = $query->with('company')
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return $this->paginated($users);
    }

    public function store(Request $request)
    {
        $currentUser = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:client_admin,client_user,read_only',
            'company_id' => $currentUser->isSuperAdmin() ? 'required|exists:companies,id' : 'nullable',
            'phone' => 'nullable|string|max:20',
            'department' => 'nullable|string|max:100',
        ]);

        $companyId = $currentUser->isSuperAdmin() ? $request->company_id : $currentUser->company_id;

        $user = User::create([
            'company_id' => $companyId,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'phone' => $request->phone,
            'department' => $request->department,
        ]);

        $user->company?->increment('users_count');

        ActivityLog::log('user_created', $currentUser, $user, "Utilisateur {$user->name} créé");

        return $this->success($user->load('company'), 'Utilisateur créé avec succès', 201);
    }

    public function show(Request $request, User $user)
    {
        $currentUser = $request->user();

        if (!$currentUser->isSuperAdmin() && $user->company_id !== $currentUser->company_id) {
            return $this->error('Utilisateur non trouvé.', 404);
        }

        return $this->success($user->load('company'));
    }

    public function update(Request $request, User $targetUser)
    {
        $currentUser = $request->user();

        if (!$currentUser->isSuperAdmin() && $targetUser->company_id !== $currentUser->company_id) {
            return $this->error('Utilisateur non trouvé.', 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $targetUser->id,
            'role' => 'sometimes|in:client_admin,client_user,read_only',
            'status' => 'sometimes|in:active,inactive,suspended',
            'phone' => 'nullable|string|max:20',
            'department' => 'nullable|string|max:100',
        ]);

        $oldValues = $targetUser->toArray();

        $targetUser->update($request->only(['name', 'email', 'role', 'status', 'phone', 'department']));

        ActivityLog::log('user_updated', $currentUser, $targetUser, "Utilisateur {$targetUser->name} modifié", $oldValues, $targetUser->toArray());

        return $this->success($targetUser->load('company'), 'Utilisateur mis à jour');
    }

    public function destroy(Request $request, User $targetUser)
    {
        $currentUser = $request->user();

        if (!$currentUser->isSuperAdmin() && $targetUser->company_id !== $currentUser->company_id) {
            return $this->error('Utilisateur non trouvé.', 404);
        }

        if ($targetUser->id === $currentUser->id) {
            return $this->error('Vous ne pouvez pas supprimer votre propre compte.', 422);
        }

        $targetUser->company?->decrement('users_count');

        ActivityLog::log('user_deleted', $currentUser, $targetUser, "Utilisateur {$targetUser->name} supprimé");

        $targetUser->delete();

        return $this->success(null, 'Utilisateur supprimé');
    }

    public function resetPassword(Request $request, User $targetUser)
    {
        $currentUser = $request->user();

        if (!$currentUser->isSuperAdmin() && $targetUser->company_id !== $currentUser->company_id) {
            return $this->error('Utilisateur non trouvé.', 404);
        }

        $request->validate([
            'password' => 'required|string|min:8',
        ]);

        $targetUser->update([
            'password' => Hash::make($request->password),
        ]);

        ActivityLog::log('password_changed', $currentUser, $targetUser, "Mot de passe réinitialisé pour {$targetUser->name}");

        return $this->success(null, 'Mot de passe réinitialisé');
    }
}
