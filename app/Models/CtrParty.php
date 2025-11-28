<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CtrParty extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'party_flag_id',
        'name_flag_id',
        'first_name',
        'last_name',
        'middle_name',
        'address',
        'country_code_id',
        'city_id',
        'account_number',
        'birthdate',
        'birthplace',
        'nationality',
        'id_type_id',
        'id_no',
        'source_of_fund_id',
        'contact_no',
        'customer_reference_no',
        'old_acct_no',
    ];

    protected function casts(): array
    {
        return [
            'birthdate' => 'date',
        ];
    }

    public function transactions()
    {
        return $this->belongsToMany(CtrTransaction::class, 'ctr_party_transaction', 'ctr_party_id', 'ctr_transaction_id')
            ->withTimestamps();
    }

    public function partyFlag()
    {
        return $this->belongsTo(PartyFlag::class);
    }


    public function nameFlag()
    {
        return $this->belongsTo(NameFlag::class);
    }

    public function countryCode()
    {
        return $this->belongsTo(CountryCode::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function idType()
    {
        return $this->belongsTo(IdType::class);
    }

    public function sourceOfFund()
    {
        return $this->belongsTo(SourceOfFund::class);
    }
}
