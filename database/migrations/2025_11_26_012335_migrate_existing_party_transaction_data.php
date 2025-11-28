<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // This migration must run BEFORE removing the foreign key columns
        // It copies existing relationships from the old structure to the new pivot table

        // Check if the old structure exists (ctr_transactions has ctr_party_id)
        if (!Schema::hasColumn('ctr_transactions', 'ctr_party_id')) {
            // Column already removed, nothing to migrate
            return;
        }

        // Get all existing party-transaction relationships from ctr_transactions
        $existingRelationships = DB::table('ctr_transactions')
            ->whereNotNull('ctr_party_id')
            ->select('id as ctr_transaction_id', 'ctr_party_id')
            ->get();

        // Insert into pivot table
        foreach ($existingRelationships as $relationship) {
            DB::table('ctr_party_transaction')->insertOrIgnore([
                'ctr_party_id' => $relationship->ctr_party_id,
                'ctr_transaction_id' => $relationship->ctr_transaction_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Clear the pivot table
        DB::table('ctr_party_transaction')->truncate();
    }
};
