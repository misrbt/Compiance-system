<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CtrTransaction extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'ctr_report_id',
        'transaction_reference_no',
        'mode_of_transaction_id',
        'transaction_amount',
        'transaction_code_id',
        'transaction_date',
        'transaction_time',
    ];

    protected function casts(): array
    {
        return [
            'transaction_date' => 'date:Y-m-d',
            'transaction_amount' => 'decimal:2',
        ];
    }

    public function ctrReport()
    {
        return $this->belongsTo(CtrReport::class);
    }

    public function modeOfTransaction()
    {
        return $this->belongsTo(ModeOfTransaction::class);
    }

    public function parties()
    {
        return $this->belongsToMany(CtrParty::class, 'ctr_party_transaction', 'ctr_transaction_id', 'ctr_party_id')
            ->withTimestamps();
    }

    // Backward compatibility: get first party (for single party transactions)
    public function party()
    {
        return $this->parties()->first();
    }

    public function participatingBanks()
    {
        return $this->hasMany(CtrParticipatingBank::class);
    }

    public function transactionCode()
    {
        return $this->belongsTo(TransactionCode::class);
    }
}
