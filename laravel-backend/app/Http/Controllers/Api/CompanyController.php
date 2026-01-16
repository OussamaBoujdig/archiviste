<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $query = Company::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        if ($plan = $request->get('plan')) {
            $query->where('plan', $plan);
        }

        $companies = $query->withCount(['users', 'documents'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return $this->paginated($companies);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:companies',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'plan' => 'required|in:starter,professional,enterprise',
        ]);

        $planLimits = [
            'starter' => ['storage' => 5 * 1024 * 1024 * 1024, 'users' => 5],
            'professional' => ['storage' => 50 * 1024 * 1024 * 1024, 'users' => 25],
            'enterprise' => ['storage' => 500 * 1024 * 1024 * 1024, 'users' => 100],
        ];

        $limits = $planLimits[$request->plan];

        $company = Company::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'plan' => $request->plan,
            'storage_limit' => $limits['storage'],
            'users_limit' => $limits['users'],
            'subscription_start' => now(),
            'subscription_end' => now()->addYear(),
        ]);

        ActivityLog::log('company_created', $request->user(), $company, "Entreprise {$company->name} créée");

        return $this->success($company, 'Entreprise créée avec succès', 201);
    }

    public function show(Company $company)
    {
        $company->load(['users', 'folders']);
        $company->loadCount(['users', 'documents', 'folders']);

        return $this->success($company);
    }

    public function update(Request $request, Company $company)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:companies,email,' . $company->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'plan' => 'sometimes|in:starter,professional,enterprise',
            'status' => 'sometimes|in:active,suspended,inactive',
        ]);

        $oldValues = $company->toArray();

        if ($request->has('plan') && $request->plan !== $company->plan) {
            $planLimits = [
                'starter' => ['storage' => 5 * 1024 * 1024 * 1024, 'users' => 5],
                'professional' => ['storage' => 50 * 1024 * 1024 * 1024, 'users' => 25],
                'enterprise' => ['storage' => 500 * 1024 * 1024 * 1024, 'users' => 100],
            ];
            $limits = $planLimits[$request->plan];
            $company->storage_limit = $limits['storage'];
            $company->users_limit = $limits['users'];
        }

        $company->fill($request->only(['name', 'email', 'phone', 'address', 'plan', 'status']));
        $company->save();

        ActivityLog::log('company_updated', $request->user(), $company, "Entreprise {$company->name} mise à jour", $oldValues, $company->toArray());

        return $this->success($company, 'Entreprise mise à jour');
    }

    public function destroy(Request $request, Company $company)
    {
        ActivityLog::log('company_deleted', $request->user(), $company, "Entreprise {$company->name} supprimée");

        $company->delete();

        return $this->success(null, 'Entreprise supprimée');
    }

    public function suspend(Request $request, Company $company)
    {
        $company->update(['status' => 'suspended']);

        ActivityLog::log('company_suspended', $request->user(), $company, "Entreprise {$company->name} suspendue");

        return $this->success($company, 'Entreprise suspendue');
    }

    public function activate(Request $request, Company $company)
    {
        $company->update(['status' => 'active']);

        ActivityLog::log('company_updated', $request->user(), $company, "Entreprise {$company->name} réactivée");

        return $this->success($company, 'Entreprise réactivée');
    }

    public function stats()
    {
        $stats = [
            'total_companies' => Company::count(),
            'active_companies' => Company::where('status', 'active')->count(),
            'suspended_companies' => Company::where('status', 'suspended')->count(),
            'total_revenue' => Company::sum('monthly_revenue'),
            'by_plan' => [
                'starter' => Company::where('plan', 'starter')->count(),
                'professional' => Company::where('plan', 'professional')->count(),
                'enterprise' => Company::where('plan', 'enterprise')->count(),
            ],
        ];

        return $this->success($stats);
    }
}
