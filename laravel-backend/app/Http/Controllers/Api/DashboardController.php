<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use App\Models\Document;
use App\Models\Folder;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function superAdmin(Request $request)
    {
        $stats = [
            'total_companies' => Company::count(),
            'active_companies' => Company::where('status', 'active')->count(),
            'suspended_companies' => Company::where('status', 'suspended')->count(),
            'total_users' => User::where('role', '!=', 'super_admin')->count(),
            'total_documents' => Document::count(),
            'total_storage' => Company::sum('storage_used'),
            'monthly_revenue' => Company::sum('monthly_revenue'),
            'companies_by_plan' => [
                'starter' => Company::where('plan', 'starter')->count(),
                'professional' => Company::where('plan', 'professional')->count(),
                'enterprise' => Company::where('plan', 'enterprise')->count(),
            ],
        ];

        $recentCompanies = Company::orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $recentActivity = ActivityLog::with('user')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return $this->success([
            'stats' => $stats,
            'recent_companies' => $recentCompanies,
            'recent_activity' => $recentActivity,
        ]);
    }

    public function clientAdmin(Request $request)
    {
        $user = $request->user();
        $company = $user->company;

        if (!$company) {
            return $this->error('Entreprise non trouvée.', 404);
        }

        $stats = [
            'total_documents' => $company->documents_count,
            'total_folders' => Folder::where('company_id', $company->id)->count(),
            'total_users' => $company->users_count,
            'storage_used' => $company->storage_used,
            'storage_limit' => $company->storage_limit,
            'storage_percentage' => $company->storage_percentage,
        ];

        $recentDocuments = Document::where('company_id', $company->id)
            ->with(['folder', 'uploader'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $recentActivity = ActivityLog::where('company_id', $company->id)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        $documentsByCategory = Document::where('company_id', $company->id)
            ->selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->pluck('count', 'category');

        return $this->success([
            'stats' => $stats,
            'company' => $company,
            'recent_documents' => $recentDocuments,
            'recent_activity' => $recentActivity,
            'documents_by_category' => $documentsByCategory,
        ]);
    }
}
