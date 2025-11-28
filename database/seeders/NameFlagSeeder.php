<?php

namespace Database\Seeders;

use App\Models\NameFlag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NameFlagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nameFlags = [
            ['name_flag_code' => 'IND', 'description' => 'Individual'],
            ['name_flag_code' => 'COR', 'description' => 'Corporation'],
            ['name_flag_code' => 'PAR', 'description' => 'Partnership'],
            ['name_flag_code' => 'SOL', 'description' => 'Sole Proprietorship'],
            ['name_flag_code' => 'GOV', 'description' => 'Government Entity'],
        ];

        foreach ($nameFlags as $flag) {
            NameFlag::create($flag);
        }
    }
}
