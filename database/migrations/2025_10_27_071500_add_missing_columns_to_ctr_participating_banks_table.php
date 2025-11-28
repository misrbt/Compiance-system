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
            $table->foreignId('ctr_transaction_id')->after('id')->constrained()->onDelete('cascade');
            $table->foreignId('participating_bank_id')->nullable()->after('ctr_transaction_id')->constrained('participating_banks')->onDelete('set null');
            $table->string('bank_name')->nullable()->after('participating_bank_id');
            $table->softDeletes()->after('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ctr_participating_banks', function (Blueprint $table) {
            $table->dropForeign(['ctr_transaction_id']);
            $table->dropForeign(['participating_bank_id']);
            $table->dropColumn(['ctr_transaction_id', 'participating_bank_id', 'bank_name', 'deleted_at']);
        });
    }
};
