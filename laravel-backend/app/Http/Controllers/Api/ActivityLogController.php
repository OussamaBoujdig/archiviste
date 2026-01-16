<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = ActivityLog::query();

        if ($user->isSuperAdmin()) {
            if ($companyId = $request->get('company_id')) {
                $query->where('company_id', $companyId);
            }
        } else {
            $query->where('company_id', $user->company_id);
        }

        if ($action = $request->get('action')) {
            $query->where('action', $action);
        }

        if ($userId = $request->get('user_id')) {
            $query->where('user_id', $userId);
        }

        if ($entityType = $request->get('entity_type')) {
            $query->where('entity_type', $entityType);
        }

        if ($from = $request->get('from')) {
            $query->where('created_at', '>=', $from);
        }

        if ($to = $request->get('to')) {
            $query->where('created_at', '<=', $to);
        }

        $logs = $query->with(['user', 'company'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 50));

        return $this->paginated($logs);
    }

    public function show(Request $request, ActivityLog $activityLog)
    {
        $user = $request->user();

        if (!$user->isSuperAdmin() && $activityLog->company_id !== $user->company_id) {
            return $this->error('Log non trouvé.', 404);
        }

        return $this->success($activityLog->load(['user', 'company']));
    }

    public function stats(Request $request)
    {
        $user = $request->user();
        $query = ActivityLog::query();

        if (!$user->isSuperAdmin()) {
            $query->where('company_id', $user->company_id);
        }

        $days = $request->get('days', 30);

        $stats = [
            'total' => (clone $query)->recent($days)->count(),
            'by_action' => [],
            'by_day' => [],
        ];

        $actions = ['login', 'upload', 'download', 'view', 'edit', 'delete', 'create_folder'];
        foreach ($actions as $action) {
            $stats['by_action'][$action] = (clone $query)->recent($days)->byAction($action)->count();
        }

        // Get daily counts for the last 7 days
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $stats['by_day'][$date] = (clone $query)
                ->whereDate('created_at', $date)
                ->count();
        }

        return $this->success($stats);
    }
}
