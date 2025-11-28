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
        Schema::create('ctr_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ctr_report_id')->constrained()->onDelete('cascade');
            $table->string('transaction_type'); // CEDP, CDEPT, CENC, etc.
            $table->string('transaction_reference_no')->nullable();
            $table->foreignId('mode_of_transaction_id')->nullable()->constrained('mode_of_transactions')->onDelete('set null');
            $table->decimal('transaction_amount', 15, 2);
            $table->string('transaction_code')->nullable();
            $table->date('transaction_date')->nullable();
            $table->string('account_number')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ctr_transactions');
    }
};
