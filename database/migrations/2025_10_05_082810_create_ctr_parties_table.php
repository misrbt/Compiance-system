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
        Schema::create('ctr_parties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ctr_transaction_id')->constrained()->onDelete('cascade');
            $table->foreignId('party_flag_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('name_flag_id')->nullable()->constrained('name_flags')->onDelete('set null');
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('middle_name')->nullable();
            $table->text('address')->nullable();
            $table->foreignId('country_code_id')->nullable()->constrained('country_codes')->onDelete('set null');
            $table->foreignId('city_id')->nullable()->constrained('cities')->onDelete('set null');
            $table->string('account_number')->nullable();
            $table->date('birthdate')->nullable();
            $table->string('birthplace')->nullable();
            $table->string('nationality')->nullable();
            $table->foreignId('id_type_id')->nullable()->constrained()->onDelete('set null');
            $table->string('id_no')->nullable();
            $table->foreignId('source_of_fund_id')->nullable()->constrained('source_of_funds')->onDelete('set null');
            $table->string('contact_no')->nullable();
            $table->decimal('transaction_amount', 15, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ctr_parties');
    }
};
