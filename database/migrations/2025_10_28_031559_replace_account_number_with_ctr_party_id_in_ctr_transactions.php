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
        Schema::table('ctr_transactions', function (Blueprint $table) {
            // Drop the account_number column
            $table->dropColumn('account_number');

            // Add foreign key to ctr_parties
            $table->foreignId('ctr_party_id')->nullable()->after('transaction_date')->constrained('ctr_parties')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ctr_transactions', function (Blueprint $table) {
            // Remove foreign key constraint and column
            $table->dropForeign(['ctr_party_id']);
            $table->dropColumn('ctr_party_id');

            // Restore account_number column
            $table->string('account_number')->nullable()->after('transaction_date');
        });
    }
};
