<?php

namespace App\Services;

use App\Models\CtrParticipatingBank;
use App\Models\CtrParty;
use App\Models\CtrTransaction;

class TransactionService
{
    /**
     * Create transaction with multiple parties and participating banks
     */
    public function createTransaction(int $reportId, array $transactionData): CtrTransaction
    {
        // Create transaction first
        $transaction = CtrTransaction::create([
            'ctr_report_id' => $reportId,
            'transaction_reference_no' => $transactionData['transaction_reference_no'] ?? null,
            'mode_of_transaction_id' => $transactionData['mode_of_transaction_id'] ?? null,
            'transaction_amount' => $transactionData['transaction_amount'],
            'transaction_code_id' => $transactionData['transaction_code_id'] ?? null,
            'transaction_date' => $transactionData['transaction_date'] ?? null,
            'transaction_time' => $transactionData['transaction_time'] ?? null,
        ]);

        // Create and attach all parties to this transaction
        $partyIds = [];
        foreach ($transactionData['parties'] as $partyData) {
            $party = CtrParty::create($partyData);
            $partyIds[] = $party->id;
        }

        // Attach parties to transaction via pivot table
        $transaction->parties()->attach($partyIds);

        // Save participating banks if any
        if (isset($transactionData['participating_banks'])) {
            $this->createParticipatingBanks($transaction->id, $transactionData['participating_banks']);
        }

        return $transaction;
    }

    /**
     * Create quick transaction for existing party
     */
    public function createQuickTransaction(int $reportId, array|int $partyIds, array $transactionData): CtrTransaction
    {
        $transaction = CtrTransaction::create([
            'ctr_report_id' => $reportId,
            'transaction_reference_no' => $transactionData['transaction_reference_no'] ?? null,
            'mode_of_transaction_id' => $transactionData['mode_of_transaction_id'] ?? null,
            'transaction_amount' => $transactionData['transaction_amount'],
            'transaction_code_id' => $transactionData['transaction_code_id'],
            'transaction_date' => $transactionData['transaction_date'] ?? null,
            'transaction_time' => $transactionData['transaction_time'] ?? null,
        ]);

        // Attach parties to transaction (support both single party and multiple parties)
        $partyIdsArray = is_array($partyIds) ? $partyIds : [$partyIds];
        $transaction->parties()->attach($partyIdsArray);

        if (!empty($transactionData['participating_banks'])) {
            $this->createParticipatingBanks($transaction->id, $transactionData['participating_banks']);
        }

        return $transaction;
    }

    /**
     * Update transaction data only
     */
    public function updateTransaction(CtrTransaction $transaction, array $transactionData): void
    {
        // Debug logging
        \Log::info('🔍 TransactionService::updateTransaction', [
            'transaction_id' => $transaction->id,
            'transaction_date_before' => $transaction->transaction_date,
            'transaction_date_received' => $transactionData['transaction_date'] ?? null,
            'transaction_date_type' => gettype($transactionData['transaction_date'] ?? null),
        ]);

        $transaction->update([
            'transaction_reference_no' => $transactionData['transaction_reference_no'] ?? null,
            'mode_of_transaction_id' => $transactionData['mode_of_transaction_id'] ?? null,
            'transaction_amount' => $transactionData['transaction_amount'],
            'transaction_code_id' => $transactionData['transaction_code_id'] ?? null,
            'transaction_date' => $transactionData['transaction_date'] ?? null,
            'transaction_time' => $transactionData['transaction_time'] ?? null,
        ]);

        \Log::info('✅ TransactionService::updateTransaction completed', [
            'transaction_id' => $transaction->id,
            'transaction_date_after' => $transaction->fresh()->transaction_date,
        ]);
    }

    /**
     * Update transaction with multiple parties data
     * @param array $createdPartyMap Reference to map tracking newly created parties to avoid duplicates
     */
    public function updateTransactionWithParty(CtrTransaction $transaction, array $transactionData, array &$createdPartyMap = []): void
    {
        // Detach all existing parties first
        $transaction->parties()->detach();

        // Process all parties from request
        $partyIds = [];
        foreach ($transactionData['parties'] as $partyData) {
            $partyIdFromRequest = $partyData['party_id'] ?? null;
            $partyDataForSave = collect($partyData)->except(['party_id'])->toArray();

            if ($partyIdFromRequest) {
                // Update existing party
                CtrParty::where('id', $partyIdFromRequest)->update($partyDataForSave);
                $partyIds[] = $partyIdFromRequest;
            } else {
                // Check if we already created this party in a previous transaction
                $partyHash = md5(json_encode($partyDataForSave));

                if (isset($createdPartyMap[$partyHash])) {
                    // Reuse the previously created party
                    $partyIds[] = $createdPartyMap[$partyHash];
                } else {
                    // Create new party
                    $newParty = CtrParty::create($partyDataForSave);
                    $createdPartyMap[$partyHash] = $newParty->id;
                    $partyIds[] = $newParty->id;
                }
            }
        }

        // Attach all parties to transaction
        $transaction->parties()->attach($partyIds);

        // Update transaction details
        $this->updateTransaction($transaction, $transactionData);

        // Update participating banks
        $this->updateParticipatingBanks($transaction, $transactionData['participating_banks'] ?? []);
    }

    /**
     * Create participating banks for a transaction
     */
    private function createParticipatingBanks(int $transactionId, array $banksData): void
    {
        foreach ($banksData as $bankData) {
            CtrParticipatingBank::create(array_merge($bankData, [
                'ctr_transaction_id' => $transactionId,
            ]));
        }
    }

    /**
     * Update participating banks for a transaction
     */
    private function updateParticipatingBanks(CtrTransaction $transaction, array $banksData): void
    {
        $transaction->participatingBanks()->delete();

        if (!empty($banksData)) {
            $this->createParticipatingBanks($transaction->id, $banksData);
        }
    }
}
