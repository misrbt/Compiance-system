<?php

namespace Database\Seeders;

use App\Models\ParticipatingBank;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ParticipatingBankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $banks = [
            ['bank_code' => 'OB', 'bank' => 'Originating Bank'],
            ['bank_code' => 'RB', 'bank' => 'Receiving Bank'],
            ['bank_code' => 'RT', 'bank' => 'Remittance Tie-Up'],
            ['bank_code' => 'IB', 'bank' => 'Intermediary Bank'],
        ];

        foreach ($banks as $bank) {
            ParticipatingBank::create($bank);
        }
    }
}
