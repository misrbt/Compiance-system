<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Remove ctr_party_id from ctr_transactions (if exists)
        if (Schema::hasColumn('ctr_transactions', 'ctr_party_id')) {
            Schema::table('ctr_transactions', function (Blueprint $table) {
                $table->dropForeign(['ctr_party_id']);
                $table->dropColumn('ctr_party_id');
            });
        }

        // Remove ctr_transaction_id from ctr_parties (if exists)
        if (Schema::hasColumn('ctr_parties', 'ctr_transaction_id')) {
            Schema::table('ctr_parties', function (Blueprint $table) {
                $table->dropForeign(['ctr_transaction_id']);
                $table->dropColumn('ctr_transaction_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restore ctr_party_id to ctr_transactions
        Schema::table('ctr_transactions', function (Blueprint $table) {
            $table->foreignId('ctr_party_id')->nullable()->constrained('ctr_parties')->onDelete('set null');
        });

        // Restore ctr_transaction_id to ctr_parties
        Schema::table('ctr_parties', function (Blueprint $table) {
            $table->foreignId('ctr_transaction_id')->nullable()->constrained('ctr_transactions')->onDelete('cascade');
        });
    }
};
