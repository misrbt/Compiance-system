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
        Schema::table('ctr_participating_banks', function (Blueprint $table) {
            $table->string('account_no')->nullable()->after('bank_name');
            $table->decimal('amount', 15, 2)->nullable()->after('account_no');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ctr_participating_banks', function (Blueprint $table) {
            $table->dropColumn(['account_no', 'amount']);
        });
    }
};
