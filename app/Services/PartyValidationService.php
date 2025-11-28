<?php

namespace App\Services;

use App\Models\CtrParty;
use App\Models\NameFlag;

class PartyValidationService
{
    private const NAME_FLAGS_REQUIRING_LAST_NAME = ['J', 'CP', 'CO', 'S', 'O', 'U'];

    /**
     * Validate last name is provided for specific name flags
     */
    public function validateLastNameForNameFlag(array $transactions): ?array
    {
        foreach ($transactions as $transIndex => $transaction) {
            foreach ($transaction['parties'] as $partyIndex => $party) {
                if (isset($party['name_flag_id'])) {
                    $nameFlag = NameFlag::find($party['name_flag_id']);

                    if ($nameFlag && in_array($nameFlag->name_flag_code, self::NAME_FLAGS_REQUIRING_LAST_NAME)) {
                        if (empty($party['last_name'])) {
                            return [
                                "transactions.{$transIndex}.parties.{$partyIndex}.last_name" =>
                                    "Last name is required when Name Flag is {$nameFlag->name_flag_code}."
                            ];
                        }
                    }
                }
            }
        }

        return null;
    }

    /**
     * Check if party with same name already exists
     */
    public function checkForDuplicateParty(array $transactions): ?array
    {
        foreach ($transactions as $transIndex => $transaction) {
            foreach ($transaction['parties'] as $partyIndex => $party) {
                $firstName = $party['first_name'] ?? '';
                $lastName = $party['last_name'] ?? '';
                $middleName = $party['middle_name'] ?? '';

                if (empty($firstName) && empty($lastName)) {
                    continue;
                }

                $duplicateQuery = CtrParty::query();

                if (!empty($firstName)) {
                    $duplicateQuery->where('first_name', $firstName);
                }

                if (!empty($lastName)) {
                    $duplicateQuery->where('last_name', $lastName);
                }

                if (!empty($middleName)) {
                    $duplicateQuery->where('middle_name', $middleName);
                }

                $existingParty = $duplicateQuery->first();

                if ($existingParty) {
                    $nameDisplay = trim(($firstName ?? '') . ' ' . ($middleName ?? '') . ' ' . ($lastName ?? ''));
                    return [
                        'duplicate_party' => "Failed to submit report. A party with the name '{$nameDisplay}' already exists Please verify the information."
                    ];
                }
            }
        }

        return null;
    }
}
