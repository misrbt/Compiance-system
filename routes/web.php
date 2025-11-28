<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\CtrReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DataConfigurationController;
use App\Http\Controllers\PortalController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Guest Routes
Route::middleware(['guest', 'prevent.login.cache'])->group(function () {
    Route::get('/', [LoginController::class, 'create']);
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
    Route::get('/register', [RegisterController::class, 'create']);
    Route::post('/register', [RegisterController::class, 'store']);
});

// Authenticated Routes
Route::middleware(['auth', 'prevent.back'])->group(function () {
    // Portal Selection
    Route::get('/portals', [PortalController::class, 'index'])->name('portals.index');
    Route::get('/portals/{portal}/enter', [PortalController::class, 'setPortal'])->name('portals.enter');

    // AMLA Portal Routes
    Route::middleware(['portal:amla'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // CTR/STR Reports
    Route::get('/reports', [CtrReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/browse-ctr', [CtrReportController::class, 'browseCtr'])->name('reports.browse-ctr');
    Route::get('/reports/browse-str', [CtrReportController::class, 'browseStr'])->name('reports.browse-str');
    Route::get('/reports/generate-ctr', [CtrReportController::class, 'generateCtr'])->name('reports.generate-ctr');
    Route::get('/reports/export-ctr', [CtrReportController::class, 'exportCtr'])->name('reports.export-ctr');
    Route::get('/reports/select-type', [CtrReportController::class, 'selectType'])->name('reports.select-type');
    Route::get('/reports/select-transaction-type', [CtrReportController::class, 'selectTransactionType'])->name('reports.select-transaction-type');

    // Submit Options (Choice between Quick Entry and Full Report) - MUST BE BEFORE {report} routes
    Route::get('/reports/submit-options', [CtrReportController::class, 'submitOptions'])->name('reports.submit-options');

    // Data Entry (Quick Transaction) - MUST BE BEFORE {report} routes
    Route::get('/reports/data-entry', [CtrReportController::class, 'dataEntry'])->name('reports.data-entry');
    Route::get('/api/search-parties', [CtrReportController::class, 'searchParties'])->name('api.search-parties');
    Route::post('/reports/quick-transaction', [CtrReportController::class, 'storeQuickTransaction'])->name('reports.store-quick-transaction');

    // CRUD routes with {report} parameter - MUST BE AFTER specific routes
    Route::get('/reports/create', [CtrReportController::class, 'create'])->name('reports.create');
    Route::post('/reports', [CtrReportController::class, 'store'])->name('reports.store');
    Route::get('/reports/{report}/view-ctr-report', [CtrReportController::class, 'show'])->name('reports.show');
    Route::get('/reports/{report}/edit', [CtrReportController::class, 'edit'])->name('reports.edit');
    Route::get('/reports/{report}/edit-transactions', [CtrReportController::class, 'editTransactions'])->name('reports.edit-transactions');
    Route::put('/reports/{report}', [CtrReportController::class, 'update'])->name('reports.update');
    Route::put('/reports/{report}/update-transactions', [CtrReportController::class, 'updateTransactions'])->name('reports.update-transactions');
    Route::delete('/reports/{report}', [CtrReportController::class, 'destroy'])->name('reports.destroy');

    // Data Configuration Management
    Route::get('/data-configuration', [DataConfigurationController::class, 'index'])->name('data-configuration.index');

    // Transaction Codes
    Route::post('/data-configuration/transaction-codes', [DataConfigurationController::class, 'storeTransactionCode'])->name('data-configuration.transaction-codes.store');
    Route::put('/data-configuration/transaction-codes/{transactionCode}', [DataConfigurationController::class, 'updateTransactionCode'])->name('data-configuration.transaction-codes.update');
    Route::delete('/data-configuration/transaction-codes/{transactionCode}', [DataConfigurationController::class, 'destroyTransactionCode'])->name('data-configuration.transaction-codes.destroy');

    // ID Types
    Route::post('/data-configuration/id-types', [DataConfigurationController::class, 'storeIdType'])->name('data-configuration.id-types.store');
    Route::put('/data-configuration/id-types/{idType}', [DataConfigurationController::class, 'updateIdType'])->name('data-configuration.id-types.update');
    Route::delete('/data-configuration/id-types/{idType}', [DataConfigurationController::class, 'destroyIdType'])->name('data-configuration.id-types.destroy');

    // Source of Funds
    Route::post('/data-configuration/source-of-funds', [DataConfigurationController::class, 'storeSourceOfFund'])->name('data-configuration.source-of-funds.store');
    Route::put('/data-configuration/source-of-funds/{sourceOfFund}', [DataConfigurationController::class, 'updateSourceOfFund'])->name('data-configuration.source-of-funds.update');
    Route::delete('/data-configuration/source-of-funds/{sourceOfFund}', [DataConfigurationController::class, 'destroySourceOfFund'])->name('data-configuration.source-of-funds.destroy');

    // Cities
    Route::post('/data-configuration/cities', [DataConfigurationController::class, 'storeCity'])->name('data-configuration.cities.store');
    Route::put('/data-configuration/cities/{city}', [DataConfigurationController::class, 'updateCity'])->name('data-configuration.cities.update');
    Route::delete('/data-configuration/cities/{city}', [DataConfigurationController::class, 'destroyCity'])->name('data-configuration.cities.destroy');

    // Country Codes
    Route::post('/data-configuration/country-codes', [DataConfigurationController::class, 'storeCountryCode'])->name('data-configuration.country-codes.store');
    Route::put('/data-configuration/country-codes/{countryCode}', [DataConfigurationController::class, 'updateCountryCode'])->name('data-configuration.country-codes.update');
    Route::delete('/data-configuration/country-codes/{countryCode}', [DataConfigurationController::class, 'destroyCountryCode'])->name('data-configuration.country-codes.destroy');

    // Party Flags
    Route::post('/data-configuration/party-flags', [DataConfigurationController::class, 'storePartyFlag'])->name('data-configuration.party-flags.store');
    Route::put('/data-configuration/party-flags/{partyFlag}', [DataConfigurationController::class, 'updatePartyFlag'])->name('data-configuration.party-flags.update');
    Route::delete('/data-configuration/party-flags/{partyFlag}', [DataConfigurationController::class, 'destroyPartyFlag'])->name('data-configuration.party-flags.destroy');

    // Mode of Transactions
    Route::post('/data-configuration/mode-of-transactions', [DataConfigurationController::class, 'storeModeOfTransaction'])->name('data-configuration.mode-of-transactions.store');
    Route::put('/data-configuration/mode-of-transactions/{modeOfTransaction}', [DataConfigurationController::class, 'updateModeOfTransaction'])->name('data-configuration.mode-of-transactions.update');
    Route::delete('/data-configuration/mode-of-transactions/{modeOfTransaction}', [DataConfigurationController::class, 'destroyModeOfTransaction'])->name('data-configuration.mode-of-transactions.destroy');

    // Participating Banks
    Route::post('/data-configuration/participating-banks', [DataConfigurationController::class, 'storeParticipatingBank'])->name('data-configuration.participating-banks.store');
    Route::put('/data-configuration/participating-banks/{participatingBank}', [DataConfigurationController::class, 'updateParticipatingBank'])->name('data-configuration.participating-banks.update');
    Route::delete('/data-configuration/participating-banks/{participatingBank}', [DataConfigurationController::class, 'destroyParticipatingBank'])->name('data-configuration.participating-banks.destroy');

    // Name Flags
    Route::post('/data-configuration/name-flags', [DataConfigurationController::class, 'storeNameFlag'])->name('data-configuration.name-flags.store');
    Route::put('/data-configuration/name-flags/{nameFlag}', [DataConfigurationController::class, 'updateNameFlag'])->name('data-configuration.name-flags.update');
    Route::delete('/data-configuration/name-flags/{nameFlag}', [DataConfigurationController::class, 'destroyNameFlag'])->name('data-configuration.name-flags.destroy');

        // Profile
        Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
        Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    });

    // Logout (outside portal group)
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
});
