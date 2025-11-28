<?php

namespace App\Http\Controllers;

use App\Models\TransactionCode;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionCodeController extends Controller
{
    public function index()
    {
        $transactionCodes = TransactionCode::query()
            ->orderBy('ca_sa')
            ->get();

        return Inertia::render('TransactionCodes/Index', [
            'transactionCodes' => $transactionCodes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ca_sa' => 'required|string|max:255|unique:transaction_codes,ca_sa',
            'transaction_title' => 'required|string|max:255',
            'trans_definition' => 'required|string',
        ]);

        TransactionCode::create($validated);

        return redirect()->route('transaction-codes.index')
            ->with('success', 'Transaction code created successfully.');
    }

    public function update(Request $request, TransactionCode $transactionCode)
    {
        $validated = $request->validate([
            'ca_sa' => 'required|string|max:255|unique:transaction_codes,ca_sa,' . $transactionCode->id,
            'transaction_title' => 'required|string|max:255',
            'trans_definition' => 'required|string',
        ]);

        $transactionCode->update($validated);

        return redirect()->route('transaction-codes.index')
            ->with('success', 'Transaction code updated successfully.');
    }

    public function destroy(TransactionCode $transactionCode)
    {
        $transactionCode->delete();

        return redirect()->route('transaction-codes.index')
            ->with('success', 'Transaction code deleted successfully.');
    }
}
