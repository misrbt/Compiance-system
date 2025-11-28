<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\CountryCode;
use App\Models\IdType;
use App\Models\ModeOfTransaction;
use App\Models\NameFlag;
use App\Models\ParticipatingBank;
use App\Models\PartyFlag;
use App\Models\SourceOfFund;
use App\Models\TransactionCode;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DataConfigurationController extends Controller
{
    public function index()
    {
        return Inertia::render('DataConfiguration/Index', [
            'transactionCodes' => TransactionCode::orderBy('ca_sa')->get(),
            'idTypes' => IdType::orderBy('id_code')->get(),
            'sourceOfFunds' => SourceOfFund::orderBy('sof_code')->get(),
            'cities' => City::orderBy('name_of_city')->get(),
            'countryCodes' => CountryCode::orderBy('country_name')->get(),
            'partyFlags' => PartyFlag::orderBy('par_code')->get(),
            'modeOfTransactions' => ModeOfTransaction::orderBy('mod_code')->get(),
            'participatingBanks' => ParticipatingBank::orderBy('bank_code')->get(),
            'nameFlags' => NameFlag::orderBy('name_flag_code')->get(),
        ]);
    }

    // Transaction Code CRUD
    public function storeTransactionCode(Request $request)
    {
        $validated = $request->validate([
            'ca_sa' => 'required|string|max:255|unique:transaction_codes,ca_sa',
            'transaction_title' => 'required|string|max:255',
            'trans_definition' => 'required|string',
        ]);

        TransactionCode::create($validated);

        return redirect()->route('data-configuration.index')
            ->with('success', 'Transaction code created successfully.');
    }

    public function updateTransactionCode(Request $request, TransactionCode $transactionCode)
    {
        $validated = $request->validate([
            'ca_sa' => 'required|string|max:255|unique:transaction_codes,ca_sa,' . $transactionCode->id,
            'transaction_title' => 'required|string|max:255',
            'trans_definition' => 'required|string',
        ]);

        $transactionCode->update($validated);

        return redirect()->route('data-configuration.index')
            ->with('success', 'Transaction code updated successfully.');
    }

    public function destroyTransactionCode(TransactionCode $transactionCode)
    {
        $transactionCode->delete();

        return redirect()->route('data-configuration.index')
            ->with('success', 'Transaction code deleted successfully.');
    }

    // ID Type CRUD
    public function storeIdType(Request $request)
    {
        $validated = $request->validate([
            'id_code' => 'required|string|max:255|unique:id_types,id_code',
            'title' => 'required|string|max:255',
        ]);

        IdType::create($validated);

        return redirect()->route('data-configuration.index')
            ->with('success', 'ID type created successfully.');
    }

    public function updateIdType(Request $request, IdType $idType)
    {
        $validated = $request->validate([
            'id_code' => 'required|string|max:255|unique:id_types,id_code,' . $idType->id,
            'title' => 'required|string|max:255',
        ]);

        $idType->update($validated);

        return redirect()->route('data-configuration.index')
            ->with('success', 'ID type updated successfully.');
    }

    public function destroyIdType(IdType $idType)
    {
        $idType->delete();

        return redirect()->route('data-configuration.index')
            ->with('success', 'ID type deleted successfully.');
    }

    // Source of Fund CRUD
    public function storeSourceOfFund(Request $request)
    {
        $validated = $request->validate([
            'sof_code' => 'required|string|max:255|unique:source_of_funds,sof_code',
            'title' => 'required|string|max:255',
        ]);

        SourceOfFund::create($validated);

        return redirect()->route('data-configuration.index')
            ->with('success', 'Source of fund created successfully.');
    }

    public function updateSourceOfFund(Request $request, SourceOfFund $sourceOfFund)
    {
        $validated = $request->validate([
            'sof_code' => 'required|string|max:255|unique:source_of_funds,sof_code,' . $sourceOfFund->id,
            'title' => 'required|string|max:255',
        ]);

        $sourceOfFund->update($validated);

        return redirect()->route('data-configuration.index')
            ->with('success', 'Source of fund updated successfully.');
    }

    public function destroySourceOfFund(SourceOfFund $sourceOfFund)
    {
        $sourceOfFund->delete();

        return redirect()->route('data-configuration.index')
            ->with('success', 'Source of fund deleted successfully.');
    }

    // City CRUD
    public function storeCity(Request $request)
    {
        $validated = $request->validate([
            'ccode' => 'required|string|max:255|unique:cities,ccode',
            'name_of_city' => 'required|string|max:255',
        ]);

        City::create($validated);

        return redirect()->route('data-configuration.index')
            ->with('success', 'City created successfully.');
    }

    public function updateCity(Request $request, City $city)
    {
        $validated = $request->validate([
            'ccode' => 'required|string|max:255|unique:cities,ccode,' . $city->id,
            'name_of_city' => 'required|string|max:255',
        ]);

        $city->update($validated);

        return redirect()->route('data-configuration.index')
            ->with('success', 'City updated successfully.');
    }

    public function destroyCity(City $city)
    {
        $city->delete();

        return redirect()->route('data-configuration.index')
            ->with('success', 'City deleted successfully.');
    }

    // Country Code CRUD
    public function storeCountryCode(Request $request)
    {
        $validated = $request->validate([
            'value' => 'required|string|max:255|unique:country_codes,value',
            'country_name' => 'required|string|max:255',
        ]);

        CountryCode::create($validated);

        return redirect()->route('data-configuration.index')
            ->with('success', 'Country code created successfully.');
    }

    public function updateCountryCode(Request $request, CountryCode $countryCode)
    {
        $validated = $request->validate([
            'value' => 'required|string|max:255|unique:country_codes,value,' . $countryCode->id,
            'country_name' => 'required|string|max:255',
        ]);

        $countryCode->update($validated);

        return redirect()->route('data-configuration.index')
            ->with('success', 'Country code updated successfully.');
    }

    public function destroyCountryCode(CountryCode $countryCode)
    {
        $countryCode->delete();

        return redirect()->route('data-configuration.index')
            ->with('success', 'Country code deleted successfully.');
    }

    // Party Flag CRUD
    public function storePartyFlag(Request $request)
    {
        $validated = $request->validate([
            'par_code' => 'required|string|max:255|unique:party_flags,par_code',
            'details' => 'required|string',
        ]);

        PartyFlag::create($validated);

        return redirect()->route('data-configuration.index')
            ->with('success', 'Party flag created successfully.');
    }

    public function updatePartyFlag(Request $request, PartyFlag $partyFlag)
    {
        $validated = $request->validate([
            'par_code' => 'required|string|max:255|unique:party_flags,par_code,' . $partyFlag->id,
            'details' => 'required|string',
        ]);

        $partyFlag->update($validated);

        return redirect()->route('data-configuration.index')
            ->with('success', 'Party flag updated successfully.');
    }

    public function destroyPartyFlag(PartyFlag $partyFlag)
    {
        $partyFlag->delete();

        return redirect()->route('data-configuration.index')
            ->with('success', 'Party flag deleted successfully.');
    }

    // Mode of Transaction CRUD
    public function storeModeOfTransaction(Request $request)
    {
        $validated = $request->validate([
            'mod_code' => 'required|string|max:255|unique:mode_of_transactions,mod_code',
            'mode_of_transaction' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        ModeOfTransaction::create($validated);

        return redirect()->route('data-configuration.index')
            ->with('success', 'Mode of transaction created successfully.');
    }

    public function updateModeOfTransaction(Request $request, ModeOfTransaction $modeOfTransaction)
    {
        $validated = $request->validate([
            'mod_code' => 'required|string|max:255|unique:mode_of_transactions,mod_code,' . $modeOfTransaction->id,
            'mode_of_transaction' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $modeOfTransaction->update($validated);

        return redirect()->route('data-configuration.index')
            ->with('success', 'Mode of transaction updated successfully.');
    }

    public function destroyModeOfTransaction(ModeOfTransaction $modeOfTransaction)
    {
        $modeOfTransaction->delete();

        return redirect()->route('data-configuration.index')
            ->with('success', 'Mode of transaction deleted successfully.');
    }

    // Participating Bank CRUD
    public function storeParticipatingBank(Request $request)
    {
        $validated = $request->validate([
            'bank_code' => 'required|string|max:255|unique:participating_banks,bank_code',
            'bank' => 'required|string|max:255',
        ]);

        ParticipatingBank::create($validated);

        return redirect()->route('data-configuration.index')
            ->with('success', 'Participating bank created successfully.');
    }

    public function updateParticipatingBank(Request $request, ParticipatingBank $participatingBank)
    {
        $validated = $request->validate([
            'bank_code' => 'required|string|max:255|unique:participating_banks,bank_code,' . $participatingBank->id,
            'bank' => 'required|string|max:255',
        ]);

        $participatingBank->update($validated);

        return redirect()->route('data-configuration.index')
            ->with('success', 'Participating bank updated successfully.');
    }

    public function destroyParticipatingBank(ParticipatingBank $participatingBank)
    {
        $participatingBank->delete();

        return redirect()->route('data-configuration.index')
            ->with('success', 'Participating bank deleted successfully.');
    }

    // Name Flag CRUD
    public function storeNameFlag(Request $request)
    {
        $validated = $request->validate([
            'name_flag_code' => 'required|string|max:255|unique:name_flags,name_flag_code',
            'description' => 'required|string',
        ]);

        NameFlag::create($validated);

        return redirect()->route('data-configuration.index')
            ->with('success', 'Name flag created successfully.');
    }

    public function updateNameFlag(Request $request, NameFlag $nameFlag)
    {
        $validated = $request->validate([
            'name_flag_code' => 'required|string|max:255|unique:name_flags,name_flag_code,' . $nameFlag->id,
            'description' => 'required|string',
        ]);

        $nameFlag->update($validated);

        return redirect()->route('data-configuration.index')
            ->with('success', 'Name flag updated successfully.');
    }

    public function destroyNameFlag(NameFlag $nameFlag)
    {
        $nameFlag->delete();

        return redirect()->route('data-configuration.index')
            ->with('success', 'Name flag deleted successfully.');
    }
}
