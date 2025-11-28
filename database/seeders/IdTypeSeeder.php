<?php

namespace Database\Seeders;

use App\Models\IdType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IdTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $idTypes = [
            ['id_code' => 'ID1', 'title' => 'Passport'],
            ['id_code' => 'ID2', 'title' => "Driver's License"],
            ['id_code' => 'ID3', 'title' => 'PRC ID'],
            ['id_code' => 'ID4', 'title' => 'NBI Clearance'],
            ['id_code' => 'ID5', 'title' => 'Police Clearance'],
            ['id_code' => 'ID6', 'title' => 'Postal ID'],
            ['id_code' => 'ID7', 'title' => "Voter's ID"],
            ['id_code' => 'ID8', 'title' => 'TIN ID'],
            ['id_code' => 'ID9', 'title' => 'Barangay Certification'],
            ['id_code' => 'ID10', 'title' => 'GSIS e-Card/UMID'],
            ['id_code' => 'ID11', 'title' => 'SSS'],
            ['id_code' => 'ID12', 'title' => 'Senior Citizen Card'],
            ['id_code' => 'ID13', 'title' => 'Overseas Workers Welfare Administration (OWWA) ID'],
            ['id_code' => 'ID14', 'title' => 'OFW ID'],
            ['id_code' => 'ID15', 'title' => "Seaman's Book"],
            ['id_code' => 'ID16', 'title' => 'Alien/Immigrant Certification of Registration'],
            ['id_code' => 'ID17', 'title' => "Gov't Office/GOCC ID"],
            ['id_code' => 'ID18', 'title' => 'Certification from National Council for the Welfare of Disabled Persons (NCWDP)'],
            ['id_code' => 'ID19', 'title' => 'Department of Social Welfare and Development (DSWD) Certification'],
            ['id_code' => 'ID20', 'title' => 'Integrated Bar of the Philippines (IBP) ID'],
            ['id_code' => 'ID21', 'title' => 'Company ID'],
            ['id_code' => 'ID22', 'title' => "Student's ID"],
            ['id_code' => 'ID23', 'title' => 'National ID/UMID ID'],
            ['id_code' => 'ID24', 'title' => 'SEC Certificate of Registration'],
            ['id_code' => 'ID25', 'title' => 'Business Registration Certificate'],
            ['id_code' => 'ID26', 'title' => 'Philhealth ID'],
            ['id_code' => 'ID0', 'title' => 'Others (Please indicate the IDs presented after the "/")'],
        ];

        foreach ($idTypes as $idType) {
            IdType::create($idType);
        }
    }
}
