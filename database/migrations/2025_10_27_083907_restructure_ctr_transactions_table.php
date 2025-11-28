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
            // Drop the old transaction_code string column
            $table->dropColumn('transaction_code');

            // Remove transaction_type column since ca_sa in transaction_codes contains this
            $table->dropColumn('transaction_type');

            // Add transaction_code_id as foreign key to transaction_codes table
            $table->foreignId('transaction_code_id')->nullable()->after('transaction_amount')->constrained('transaction_codes')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ctr_transactions', function (Blueprint $table) {
            // Remove the foreign key constraint and column
            $table->dropForeign(['transaction_code_id']);
            $table->dropColumn('transaction_code_id');

            // Restore the old columns
            $table->string('transaction_code')->nullable()->after('transaction_amount');
            $table->string('transaction_type')->after('ctr_report_id');
        });
    }
};
