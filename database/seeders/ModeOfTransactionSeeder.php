<?php

namespace Database\Seeders;

use App\Models\ModeOfTransaction;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ModeOfTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modes = [
            ['mod_code' => 'CSH', 'mode_of_transaction' => 'Cash', 'description' => 'Cash transaction'],
            ['mod_code' => 'CHK', 'mode_of_transaction' => 'Check', 'description' => 'Check transaction'],
            ['mod_code' => 'EFT', 'mode_of_transaction' => 'Electronic Fund Transfer', 'description' => 'Electronic fund transfer'],
            ['mod_code' => 'WIR', 'mode_of_transaction' => 'Wire Transfer', 'description' => 'Wire transfer'],
            ['mod_code' => 'OTC', 'mode_of_transaction' => 'Over the Counter', 'description' => 'Over the counter transaction'],
        ];

        foreach ($modes as $mode) {
            ModeOfTransaction::create($mode);
        }
    }
}
