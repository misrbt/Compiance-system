<?php

namespace Database\Seeders;

use App\Models\PartyFlag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PartyFlagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $partyFlags = [
            ['par_code' => 'PA', 'details' => 'Payor/Sender'],
            ['par_code' => 'RE', 'details' => 'Receiver/Beneficiary'],
            ['par_code' => 'AU', 'details' => 'Authorized Representative'],
            ['par_code' => 'WI', 'details' => 'Witness'],
            ['par_code' => 'AG', 'details' => 'Agent'],
        ];

        foreach ($partyFlags as $flag) {
            PartyFlag::create($flag);
        }
    }
}
