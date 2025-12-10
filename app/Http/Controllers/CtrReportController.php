<?php

namespace App\Http\Controllers;

use App\Models\CtrParty;
use App\Models\CtrReport;
use App\Models\TransactionCode;
use App\Http\Requests\UpdateCtrReportRequest;
use App\Http\Requests\UpdateTransactionsRequest;
use App\Services\ReportService;
use App\Services\TransactionService;
use App\Services\PartyValidationService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CtrReportController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private ReportService $reportService,
        private TransactionService $transactionService,
        private PartyValidationService $partyValidationService
    ) {}

    /**
     * Format multiple names with proper grammar
     * Examples:
     * - 2 names: "John Doe and Jane Smith"
     * - 3+ names: "John Doe, Jane Smith, and Bob Johnson"
     */
    private function formatNamesGrammatically(array $names): string
    {
        $count = count($names);

        if ($count === 0) {
            return '';
        }

        if ($count === 1) {
            return $names[0];
        }

        if ($count === 2) {
            return "{$names[0]} and {$names[1]}";
        }

        // 3 or more names: use Oxford comma
        $lastIndex = $count - 1;
        $allButLast = array_slice($names, 0, $lastIndex);
        $last = $names[$lastIndex];

        return implode(', ', $allButLast) . ', and ' . $last;
    }
    public function index(Request $request)
    {
        $query = CtrReport::with(['user', 'transactions.transactionCode', 'transactions.parties']);

        // Filter by submission date range
        if ($request->filled('date_from')) {
            $query->where('submission_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('submission_date', '<=', $request->date_to);
        }

        // Filter by report type
        if ($request->filled('report_type')) {
            $query->where('report_type', $request->report_type);
        }


        $reports = $query->latest('submission_date')
            ->latest('created_at')
            ->get();

        return Inertia::render('Reports/Index', [
            'reports' => $reports,
            'filters' => [
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
                'report_type' => $request->report_type,
            ],
        ]);
    }

    public function browseCtr(Request $request)
    {
        $reports = CtrReport::with([
            'user',
            'transactions' => function ($query) {
                // Load ALL transactions (don't filter by date here - let frontend handle it)
                $query->with([
                    'parties.partyFlag',
                    'parties.nameFlag',
                    'parties.idType',
                    'parties.sourceOfFund',
                    'parties.city',
                    'parties.countryCode',
                    'transactionCode',
                    'modeOfTransaction',
                    'participatingBanks.participatingBank'
                ]);
            }
        ])
            ->where('report_type', 'CTR')
            ->latest('submission_date')
            ->latest('created_at')
            ->get();

        return Inertia::render('Reports/BrowseCTR', [
            'reports' => $reports,
            'filters' => [
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
                'search' => $request->search,
            ],
        ]);
    }


    public function generateCtr(Request $request)
    {
        $ids = explode(',', $request->input('ids', ''));
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        $query = CtrReport::with([
            'transactions.parties.partyFlag',
            'transactions.parties.nameFlag',
            'transactions.parties.idType',
            'transactions.parties.sourceOfFund',
            'transactions.parties.city',
            'transactions.parties.countryCode',
            'transactions.participatingBanks.participatingBank',
            'transactions.modeOfTransaction',
            'transactions.transactionCode'
        ])
            ->where('report_type', 'CTR');

        if (!empty($ids) && $ids[0] !== '') {
            $query->whereIn('id', $ids);
        }

        if ($dateFrom) {
            $query->where('submission_date', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->where('submission_date', '<=', $dateTo);
        }

        $reports = $query->latest('submission_date')->get();

        // Convert party (singular) to parties array for GenerateCtr page compatibility
        foreach ($reports as $report) {
            foreach ($report->transactions as $transaction) {
                $transaction->parties = $transaction->party ? [$transaction->party] : [];
            }
        }

        return Inertia::render('Reports/GenerateCtr', [
            'reports' => $reports,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    public function browseStr(Request $request)
    {
        $query = CtrReport::with(['user', 'transactions'])
            ->where('report_type', 'STR');

        // Filter by submission date range
        if ($request->filled('date_from')) {
            $query->where('submission_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('submission_date', '<=', $request->date_to);
        }

        // Filter by status


        $reports = $query->latest('submission_date')
            ->latest('created_at')
            ->get();

        return Inertia::render('Reports/BrowseStr', [
            'reports' => $reports,
            'filters' => [
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
            ],
        ]);
    }

    public function selectType()
    {
        return Inertia::render('Reports/SelectType');
    }

    public function selectTransactionType(Request $request)
    {
        $reportType = $request->query('type', 'CTR');

        $transactionCodes = TransactionCode::orderBy('ca_sa')->get();

        return Inertia::render('Reports/SelectTransactionType', [
            'reportType' => $reportType,
            'transactionCodes' => $transactionCodes,
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Reports/Create', [
            'reportType' => $request->query('report_type', 'CTR'),
            'transactionType' => $request->query('transaction_type'),
            'referenceData' => $this->reportService->getReferenceData(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'report_type' => 'required|in:CTR,STR',
            'transaction_type' => 'required|string',
            'submission_date' => 'nullable|date',
            'transactions' => 'required|array',
            'transactions.*.account_type' => 'required|string|in:Individual,Corporate,Joint',
            'transactions.*.transaction_reference_no' => 'nullable|string',
            'transactions.*.mode_of_transaction_id' => 'nullable|exists:mode_of_transactions,id',
            'transactions.*.transaction_amount' => 'required|numeric|min:0',
            'transactions.*.transaction_code_id' => 'nullable|exists:transaction_codes,id',
            'transactions.*.transaction_date' => 'nullable|date',
            'transactions.*.transaction_time' => 'nullable|date_format:H:i:s,H:i',
            'transactions.*.account_number' => 'nullable|string',
            'transactions.*.parties' => 'required|array',
            'transactions.*.parties.*.party_flag_id' => 'required|exists:party_flags,id',
            'transactions.*.parties.*.account_type' => 'required|string|in:Individual,Corporate,Joint',
            'transactions.*.parties.*.name_flag_id' => 'nullable|exists:name_flags,id',
            'transactions.*.parties.*.first_name' => 'nullable|string',
            'transactions.*.parties.*.last_name' => 'nullable|string',
            'transactions.*.parties.*.middle_name' => 'nullable|string',
            'transactions.*.parties.*.address' => 'nullable|string',
            'transactions.*.parties.*.country_code_id' => 'nullable|exists:country_codes,id',
            'transactions.*.parties.*.city_id' => 'nullable|exists:cities,id',
            'transactions.*.parties.*.account_number' => 'nullable|string',
            'transactions.*.parties.*.birthdate' => 'nullable|date',
            'transactions.*.parties.*.birthplace' => 'nullable|string',
            'transactions.*.parties.*.nationality' => 'nullable|string',
            'transactions.*.parties.*.id_type_id' => 'nullable|exists:id_types,id',
            'transactions.*.parties.*.id_no' => 'nullable|string',
            'transactions.*.parties.*.source_of_fund_id' => 'nullable|exists:source_of_funds,id',
            'transactions.*.parties.*.contact_no' => ['nullable', 'string', 'regex:/^(\+63|\+\(63\)|0)[\s\-]?9\d{9}$/'],
            'transactions.*.parties.*.transaction_amount' => 'nullable|numeric|min:0',
            'transactions.*.parties.*.customer_reference_no' => 'nullable|string',
            'transactions.*.parties.*.old_acct_no' => 'nullable|string',
            'transactions.*.participating_banks' => 'nullable|array',
            'transactions.*.participating_banks.*.participating_bank_id' => 'nullable|exists:participating_banks,id',
            'transactions.*.participating_banks.*.bank_name' => 'nullable|string',
            'transactions.*.participating_banks.*.account_no' => 'nullable|string',
            'transactions.*.participating_banks.*.amount' => 'nullable|numeric|min:0',
        ]);

        // Validate last name for specific name flags
        if ($errors = $this->partyValidationService->validateLastNameForNameFlag($validated['transactions'])) {
            return back()->withErrors($errors)->withInput();
        }

        // Check for duplicate party names
        if ($errors = $this->partyValidationService->checkForDuplicateParty($validated['transactions'])) {
            return back()->withErrors($errors)->withInput();
        }

        $report = CtrReport::create([
            'user_id' => $request->user()->id,
            'report_type' => $validated['report_type'],
            'submission_date' => $validated['submission_date'] ?? now()->toDateString(),
        ]);

        foreach ($validated['transactions'] as $transactionData) {
            $this->transactionService->createTransaction($report->id, $transactionData);
        }

        return redirect()->route('reports.browse-ctr')->with('success', 'Report created successfully');
    }

    public function show(CtrReport $report, Request $request)
    {
        $this->authorize('view', $report);

        $report = $this->reportService->loadReportWithRelationships($report);

        // If party_id is provided, filter to show only that party's information
        $partyId = $request->query('party_id');
        $partyTransactions = [];

        if ($partyId) {
            // Fetch ALL transactions for this party, regardless of report
            $partyTransactions = \App\Models\CtrTransaction::whereHas('parties', function ($query) use ($partyId) {
                $query->where('ctr_parties.id', $partyId);
            })
                ->with([
                    'parties.partyFlag',
                    'parties.nameFlag',
                    'parties.idType',
                    'parties.sourceOfFund',
                    'parties.city',
                    'parties.countryCode',
                    'participatingBanks.participatingBank',
                    'modeOfTransaction',
                    'transactionCode'
                ])
                ->orderBy('transaction_date', 'desc')
                ->get();

            // For each transaction, we need to ensure the parties collection is loaded correctly
            // The 'with' clause above does this, but we want to make sure the structure matches what the frontend expects
        }

        return Inertia::render('Reports/View', [
            'report' => $report,
            'filterPartyId' => $partyId,
            'partyTransactions' => $partyTransactions,
        ]);
    }

    public function edit(CtrReport $report)
    {
        $this->authorize('update', $report);

        $report = $this->reportService->loadReportForEdit($report);
        $this->reportService->convertPartyToParties($report);

        return Inertia::render('Reports/Edit', [
            'report' => $report,
            'reportType' => $report->report_type,
            'transactionType' => $this->reportService->getTransactionType($report),
            'referenceData' => $this->reportService->getReferenceData(),
        ]);
    }

    public function editTransactions(CtrReport $report)
    {
        $this->authorize('update', $report);

        // Get the first party from the first transaction
        $firstTransaction = $report->transactions->first();
        if (!$firstTransaction) {
            return redirect()->route('reports.browse-ctr')->with('error', 'No transactions found for this report');
        }

        $firstTransaction->load('parties');
        $party = $firstTransaction->parties->first();

        if (!$party) {
            return redirect()->route('reports.browse-ctr')->with('error', 'No party found for this report');
        }

        // Load all transactions for this party (not just from current report)
        $allPartyTransactions = \App\Models\CtrTransaction::whereHas('parties', function ($query) use ($party) {
            $query->where('ctr_parties.id', $party->id);
        })
            ->with(['transactionCode', 'modeOfTransaction', 'ctrReport', 'parties'])
            ->orderBy('transaction_date', 'desc')
            ->get();

        // Update the report's transactions collection to include all party transactions
        $report->setRelation('transactions', $allPartyTransactions);

        $partyName = trim(($party->first_name ?? '') . ' ' . ($party->middle_name ?? '') . ' ' . ($party->last_name ?? ''));

        return Inertia::render('Reports/EditTransaction', [
            'report' => $report,
            'reportType' => $report->report_type,
            'transactionType' => $this->reportService->getTransactionType($report),
            'referenceData' => $this->reportService->getTransactionReferenceData(),
            'partyName' => $partyName,
        ]);
    }

    public function updateTransactions(UpdateTransactionsRequest $request, CtrReport $report)
    {
        $this->authorize('update', $report);

        $validated = $request->validated();

        // Debug logging - see what we received from frontend
        \Log::info('🔍 CtrReportController::updateTransactions - Request Data', [
            'report_id' => $report->id,
            'transactions_count' => count($validated['transactions']),
            'transactions' => array_map(function ($t) {
                return [
                    'transaction_id' => $t['transaction_id'] ?? null,
                    'transaction_date' => $t['transaction_date'] ?? null,
                    'transaction_amount' => $t['transaction_amount'] ?? null,
                ];
            }, $validated['transactions']),
        ]);

        $report->update([
            'report_type' => $validated['report_type'],
            'submission_date' => $validated['submission_date'] ?? null,
        ]);

        foreach ($validated['transactions'] as $transactionData) {
            if (!isset($transactionData['transaction_id'])) {
                continue;
            }

            $transaction = $report->transactions()->where('id', $transactionData['transaction_id'])->first();

            if ($transaction) {
                $this->transactionService->updateTransaction($transaction, $transactionData);
            }
        }

        return redirect()->route('reports.browse-ctr')->with('success', 'Transactions updated successfully');
    }

    public function update(UpdateCtrReportRequest $request, CtrReport $report)
    {
        $this->authorize('update', $report);

        $validated = $request->validated();

        // Validate last name for specific name flags
        if ($errors = $this->partyValidationService->validateLastNameForNameFlag($validated['transactions'])) {
            return back()->withErrors($errors)->withInput();
        }

        $report->update([
            'report_type' => $validated['report_type'],
            'submission_date' => $validated['submission_date'] ?? null,
        ]);

        // Process all transactions and track newly created parties to avoid duplicates
        $createdPartyMap = []; // Map of party data hash => party ID

        foreach ($validated['transactions'] as $transactionData) {
            if (!isset($transactionData['transaction_id'])) {
                continue;
            }

            $transaction = $report->transactions()->with('parties')->where('id', $transactionData['transaction_id'])->first();

            if ($transaction) {
                $this->transactionService->updateTransactionWithParty($transaction, $transactionData, $createdPartyMap);
            }
        }

        return redirect()->route('reports.browse-ctr')->with('success', 'Report updated successfully');
    }

    public function destroy(CtrReport $report)
    {
        $this->authorize('delete', $report);

        $this->reportService->deleteReportWithRelations($report);

        return redirect()->route('reports.browse-ctr')->with('success', 'Report deleted successfully');
    }

    public function searchParties(Request $request)
    {
        $query = trim($request->input('query', ''));

        // If empty or too short, return nothing
        if (strlen($query) < 1) {
            return response()->json([]);
        }

        // Normalize search value (lowercase + trim)
        $normalizedSearch = '%' . strtolower($query) . '%';

        // First, find parties matching the search query
        $matchedParties = CtrParty::query()
            ->where(function ($nameQuery) use ($normalizedSearch) {
                $nameQuery
                    ->whereRaw('LOWER(first_name) LIKE ?', [$normalizedSearch])
                    ->orWhereRaw('LOWER(middle_name) LIKE ?', [$normalizedSearch])
                    ->orWhereRaw('LOWER(last_name) LIKE ?', [$normalizedSearch])
                    ->orWhereRaw("LOWER(TRIM(CONCAT_WS(' ', first_name, middle_name, last_name))) LIKE ?", [$normalizedSearch]);
            })
            ->limit(20)
            ->pluck('id');

        // Get reports that contain these matched parties
        $reportIds = \DB::table('ctr_party_transaction')
            ->join('ctr_transactions', 'ctr_party_transaction.ctr_transaction_id', '=', 'ctr_transactions.id')
            ->whereIn('ctr_party_transaction.ctr_party_id', $matchedParties)
            ->pluck('ctr_transactions.ctr_report_id')
            ->unique();

        // For each report, get ALL current parties (from the most recent transaction state)
        $results = [];
        $processedReportPartyCombinations = [];

        foreach ($reportIds as $reportId) {
            // Get all unique parties across ALL transactions in this report
            $allPartyIdsInReport = \DB::table('ctr_party_transaction')
                ->join('ctr_transactions', 'ctr_party_transaction.ctr_transaction_id', '=', 'ctr_transactions.id')
                ->where('ctr_transactions.ctr_report_id', $reportId)
                ->pluck('ctr_party_transaction.ctr_party_id')
                ->unique()
                ->sort()
                ->values();

            // Create unique key for this report's party combination
            $partyKey = $allPartyIdsInReport->join('-');

            // Skip if we already processed this party combination
            if (in_array($partyKey, $processedReportPartyCombinations)) {
                continue;
            }
            $processedReportPartyCombinations[] = $partyKey;

            // Get full party details
            $allPartiesInReport = CtrParty::whereIn('id', $allPartyIdsInReport)->get();

            // Determine if joint account (more than 1 party)
            $isJointAccount = $allPartyIdsInReport->count() > 1;

            if ($isJointAccount) {
                // Create grouped result for joint account showing ALL parties in the report
                $partyNames = $allPartiesInReport->map(function ($p) {
                    return trim("{$p->first_name} {$p->middle_name} {$p->last_name}");
                });

                // Format names with proper grammar: "Name1, Name2, and Name3"
                $formattedNames = $this->formatNamesGrammatically($partyNames->toArray());

                $firstParty = $allPartiesInReport->first();

                $results[] = [
                    'id'             => $firstParty->id,
                    'party_ids'      => $allPartyIdsInReport->toArray(),
                    'first_name'     => $firstParty->first_name,
                    'middle_name'    => $firstParty->middle_name,
                    'last_name'      => $firstParty->last_name,
                    'full_name'      => $formattedNames,
                    'account_number' => $firstParty->account_number,
                    'birthdate'      => $firstParty->birthdate,
                    'address'        => $firstParty->address,
                    'contact_no'     => $firstParty->contact_no,
                    'is_joint_account' => true,
                ];
            } else {
                // Single party
                $party = $allPartiesInReport->first();

                $results[] = [
                    'id'             => $party->id,
                    'party_ids'      => [$party->id],
                    'first_name'     => $party->first_name,
                    'middle_name'    => $party->middle_name,
                    'last_name'      => $party->last_name,
                    'full_name'      => trim("{$party->first_name} {$party->middle_name} {$party->last_name}"),
                    'account_number' => $party->account_number,
                    'birthdate'      => $party->birthdate,
                    'address'        => $party->address,
                    'contact_no'     => $party->contact_no,
                    'is_joint_account' => false,
                ];
            }
        }

        return response()->json(array_slice($results, 0, 50));
    }

    public function submitOptions()
    {
        return Inertia::render('Reports/SubmitOptions');
    }

    public function dataEntry(Request $request)
    {
        return Inertia::render('Reports/DataEntry', [
            'referenceData' => $this->reportService->getQuickEntryReferenceData(),
            'preselectedParty' => $request->filled('party_id') ? CtrParty::find($request->party_id) : null,
        ]);
    }

    public function storeQuickTransaction(Request $request)
    {
        // -------------------------
        // VALIDATION
        // -------------------------
        $validated = $request->validate([
            'party_ids' => 'required|array|min:1',
            'party_ids.*' => 'required|exists:ctr_parties,id',
            'submission_date' => 'nullable|date',
            'transaction_reference_no' => 'required|string|max:255',
            'mode_of_transaction_id' => 'required|exists:mode_of_transactions,id',
            'transaction_amount' => 'required|numeric|min:0',
            'transaction_code_id' => 'required|exists:transaction_codes,id',
            'transaction_date' => 'required|date',
            'transaction_time' => 'nullable|date_format:H:i:s,H:i',

            'participating_banks' => 'nullable|array',
            'participating_banks.*.participating_bank_id' => 'required_with:participating_banks|exists:participating_banks,id',
            'participating_banks.*.bank_name' => 'required_with:participating_banks|string|max:255',
            'participating_banks.*.account_no' => 'required_with:participating_banks|string|max:255',
            'participating_banks.*.amount' => 'required_with:participating_banks|numeric|min:0',
            'participating_banks.*.currency' => 'nullable|string',
        ]);

        $partyIds = $validated['party_ids'];
        $submissionDate = $validated['submission_date'] ?? now()->toDateString();

        // Use first party for report lookup (all parties in joint account share same report)
        $firstPartyId = $partyIds[0];
        $party = CtrParty::findOrFail($firstPartyId);

        $report = $this->reportService->findOrCreateReportForParty($firstPartyId, $submissionDate);
        $transaction = $this->transactionService->createQuickTransaction($report->id, $partyIds, $validated);

        // -------------------------
        // REDIRECT TO SUCCESS PAGE
        // -------------------------
        return Inertia::render('Reports/TransactionSuccess', [
            'report' => $report,
            'party' => $party,
            'transaction' => $transaction,
        ]);
    }
}
