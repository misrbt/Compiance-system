<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartyFlag extends Model
{
    use HasFactory;

    protected $fillable = [
        'par_code',
        'details',
    ];
}
