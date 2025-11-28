<?php

namespace Database\Seeders;

use App\Models\CountryCode;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CountryCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $countryCodes = [
            ['value' => 'PH', 'country_name' => 'Philippines'],
            ['value' => 'US', 'country_name' => 'United States'],
            ['value' => 'JP', 'country_name' => 'Japan'],
            ['value' => 'CN', 'country_name' => 'China'],
            ['value' => 'SG', 'country_name' => 'Singapore'],
            ['value' => 'HK', 'country_name' => 'Hong Kong'],
            ['value' => 'AU', 'country_name' => 'Australia'],
            ['value' => 'CA', 'country_name' => 'Canada'],
            ['value' => 'GB', 'country_name' => 'United Kingdom'],
            ['value' => 'KR', 'country_name' => 'South Korea'],
        ];

        foreach ($countryCodes as $country) {
            CountryCode::create($country);
        }
    }
}
