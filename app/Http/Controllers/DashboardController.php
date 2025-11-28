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
        $userId = auth()->id();

        // Get statistics
        $ctrCount = CtrReport::where('user_id', $userId)
            ->where('report_type', 'CTR')
            ->count();

        $strCount = CtrReport::where('user_id', $userId)
            ->where('report_type', 'STR')
            ->count();

        $totalReports = $ctrCount + $strCount;


        // Get monthly data for the last 6 months
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthName = $month->format('M');

            $ctrMonthCount = CtrReport::where('user_id', $userId)
                ->where('report_type', 'CTR')
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();

            $strMonthCount = CtrReport::where('user_id', $userId)
                ->where('report_type', 'STR')
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();

            $monthlyData[] = [
                'month' => $monthName,
                'ctr' => $ctrMonthCount,
                'str' => $strMonthCount,
            ];
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'ctr' => $ctrCount,
                'str' => $strCount,
                'total' => $totalReports,
            ],
            'monthlyData' => $monthlyData,
        ]);
    }
}
