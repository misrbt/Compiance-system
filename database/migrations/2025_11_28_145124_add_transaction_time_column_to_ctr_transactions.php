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
            // Change transaction_date from datetime to date
            $table->date('transaction_date')->nullable()->change();

            // Add transaction_time column as time type
            $table->time('transaction_time')->nullable()->after('transaction_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ctr_transactions', function (Blueprint $table) {
            // Change transaction_date back to datetime
            $table->dateTime('transaction_date')->nullable()->change();

            // Drop transaction_time column
            $table->dropColumn('transaction_time');
        });
    }
};
