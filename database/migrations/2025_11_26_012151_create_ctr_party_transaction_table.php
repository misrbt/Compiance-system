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
        Schema::create('ctr_party_transaction', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ctr_party_id')->constrained('ctr_parties')->onDelete('cascade');
            $table->foreignId('ctr_transaction_id')->constrained('ctr_transactions')->onDelete('cascade');
            $table->timestamps();

            // Ensure unique combination of party and transaction
            $table->unique(['ctr_party_id', 'ctr_transaction_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ctr_party_transaction');
    }
};
