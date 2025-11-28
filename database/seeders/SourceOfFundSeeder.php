<?php

namespace Database\Seeders;

use App\Models\SourceOfFund;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SourceOfFundSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sourceOfFunds = [
            ['sof_code' => 'SOF01', 'title' => 'Salary/Wages'],
            ['sof_code' => 'SOF02', 'title' => 'Business Income'],
            ['sof_code' => 'SOF03', 'title' => 'Investment Returns'],
            ['sof_code' => 'SOF04', 'title' => 'Remittance'],
            ['sof_code' => 'SOF05', 'title' => 'Savings'],
            ['sof_code' => 'SOF06', 'title' => 'Pension/Retirement'],
            ['sof_code' => 'SOF07', 'title' => 'Inheritance/Gift'],
            ['sof_code' => 'SOF08', 'title' => 'Loan Proceeds'],
            ['sof_code' => 'SOF09', 'title' => 'Sale of Property'],
            ['sof_code' => 'SOF10', 'title' => 'Others'],
        ];

        foreach ($sourceOfFunds as $sof) {
            SourceOfFund::create($sof);
        }
    }
}
