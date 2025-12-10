<?php

namespace App\Http\Controllers;

use App\Models\CtrReport;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Get statistics for all reports (not filtered by user)
        $ctrCount = CtrReport::where('report_type', 'CTR')->count();

        $totalReports = $ctrCount;

        // Get monthly data for the last 6 months
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthName = $month->format('M');

            $ctrMonthCount = CtrReport::where('report_type', 'CTR')
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();

            $monthlyData[] = [
                'month' => $monthName,
                'ctr' => $ctrMonthCount,
            ];
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'ctr' => $ctrCount,
                'str' => 0,
                'total' => $totalReports,
            ],
            'monthlyData' => $monthlyData,
        ]);
    }
}
