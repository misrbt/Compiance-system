<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;

use App\Models\City;
use App\Models\CountryCode;
use App\Models\CtrReport;
use App\Models\IdType;
use App\Models\ModeOfTransaction;
use App\Models\NameFlag;
use App\Models\ParticipatingBank;
use App\Models\PartyFlag;
use App\Models\SourceOfFund;
use App\Models\TransactionCode;

class ReportService
{
    /**
     * Get all reference data needed for forms
     */
    public function getReferenceData(): array
    {
        return [
            'idTypes' => IdType::orderBy('id_code')->get(),
            'sourceOfFunds' => SourceOfFund::orderBy('sof_code')->get(),
            'cities' => City::orderBy('name_of_city')->get(),
            'countryCodes' => CountryCode::orderBy('country_name')->get(),
            'partyFlags' => PartyFlag::orderBy('par_code')->get(),
            'modeOfTransactions' => ModeOfTransaction::orderByRaw('CAST(mod_code AS INTEGER)')->get(),
            'participatingBanks' => ParticipatingBank::orderBy('bank_code')->get(),
            'nameFlags' => NameFlag::orderBy('name_flag_code')->get(),
            'transactionCodes' => TransactionCode::orderBy('ca_sa')->get(),
        ];
    }

    /**
     * Get minimal reference data for transaction editing
     */
    public function getTransactionReferenceData(): array
    {
        return [
            'modeOfTransactions' => ModeOfTransaction::orderByRaw('CAST(mod_code AS INTEGER)')->get(),
            'transactionCodes' => TransactionCode::orderBy('ca_sa')->get(),
        ];
    }

    /**
     * Get reference data for quick transaction entry
     */
    public function getQuickEntryReferenceData(): array
    {
        return [
            'modeOfTransactions' => ModeOfTransaction::orderByRaw('CAST(mod_code AS INTEGER)')->get(),
            'participatingBanks' => ParticipatingBank::orderBy('bank_code')->get(),
            'transactionCodes' => TransactionCode::orderBy('ca_sa')->get(),
        ];
    }

    /**
     * Load report with all relationships
     */
    public function loadReportWithRelationships(CtrReport $report): CtrReport
    {
        return $report->load([
            'transactions.parties.partyFlag',
            'transactions.parties.nameFlag',
            'transactions.parties.idType',
            'transactions.parties.sourceOfFund',
            'transactions.parties.city',
            'transactions.parties.countryCode',
            'transactions.participatingBanks.participatingBank',
            'transactions.modeOfTransaction',
            'transactions.transactionCode'
        ]);
    }

    /**
     * Load report for editing
     */
    public function loadReportForEdit(CtrReport $report): CtrReport
    {
        return $report->load([
            'transactions.parties',
            'transactions.participatingBanks',
            'transactions.transactionCode'
        ]);
    }

    /**
     * Convert party relationship to parties array for compatibility
     * Note: With many-to-many relationship, parties are already loaded as a collection
     */
    public function convertPartyToParties(CtrReport $report): void
    {
        foreach ($report->transactions as $transaction) {
            // Parties are already loaded via belongsToMany relationship
            // Convert to array for frontend compatibility
            if (!isset($transaction->parties)) {
                $transaction->parties = [];
            }
        }
    }

    /**
     * Get transaction type from report
     */
    public function getTransactionType(CtrReport $report): ?string
    {
        return $report->transactions->first()?->transactionCode?->ca_sa ?? null;
    }

    /**
     * Find or create report for a party and date
     * For joint accounts, this finds ANY report containing the party
     */
    public function findOrCreateReportForParty(int $partyId, string $submissionDate): CtrReport
    {
        // Find report where this party is involved (including joint accounts)
        $report = CtrReport::where('user_id', Auth::id())
            ->where('report_type', 'CTR')
            ->where('submission_date', $submissionDate)
            ->whereHas('transactions.parties', function ($query) use ($partyId) {
                $query->where('ctr_parties.id', $partyId);
            })
            ->first();

        if (!$report) {
            $report = CtrReport::create([
                'user_id' => Auth::id(),
                'report_type' => 'CTR',
                'submission_date' => $submissionDate,
            ]);
        }

        return $report;
    }

    /**
     * Delete report with all related data
     */
    public function deleteReportWithRelations(CtrReport $report): void
    {
        foreach ($report->transactions as $transaction) {
            // Delete all parties associated with this transaction
            foreach ($transaction->parties as $party) {
                $party->delete();
            }

            $transaction->participatingBanks()->delete();
            $transaction->delete();
        }

        $report->delete();
    }
}
