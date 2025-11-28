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
        Schema::table('ctr_parties', function (Blueprint $table) {
            $table->string('customer_reference_no')->nullable()->after('transaction_amount');
            $table->string('old_acct_no')->nullable()->after('customer_reference_no');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ctr_parties', function (Blueprint $table) {
            $table->dropColumn(['customer_reference_no', 'old_acct_no']);
        });
    }
};
