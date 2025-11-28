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
            $table->dateTime('transaction_date')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ctr_transactions', function (Blueprint $table) {
            $table->date('transaction_date')->nullable()->change();
        });
    }
};
