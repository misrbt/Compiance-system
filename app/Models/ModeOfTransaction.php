<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModeOfTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'mod_code',
        'mode_of_transaction',
        'description',
    ];
}
