<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CtrParticipatingBank extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'ctr_transaction_id',
        'participating_bank_id',
        'bank_name',
        'account_no',
        'amount',
    ];

    public function ctrTransaction()
    {
        return $this->belongsTo(CtrTransaction::class);
    }

    public function participatingBank()
    {
        return $this->belongsTo(ParticipatingBank::class);
    }

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
        ];
    }
}
