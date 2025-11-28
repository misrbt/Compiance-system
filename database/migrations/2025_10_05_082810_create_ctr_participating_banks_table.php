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
        Schema::create('ctr_participating_banks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ctr_transaction_id')->constrained()->onDelete('cascade');
            $table->foreignId('participating_bank_id')->nullable()->constrained('participating_banks')->onDelete('set null');
            $table->string('bank_name')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ctr_participating_banks');
    }
};
