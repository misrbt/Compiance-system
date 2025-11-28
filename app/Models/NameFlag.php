<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NameFlag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_flag_code',
        'description',
    ];
}
