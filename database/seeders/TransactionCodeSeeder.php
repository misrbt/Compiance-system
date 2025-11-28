<?php

namespace Database\Seeders;

use App\Models\TransactionCode;
use Illuminate\Database\Seeder;

class TransactionCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $transactionCodes = [
            // Image 1 - Page 1
            ['ca_sa' => 'CDEPC', 'transaction_title' => 'Deposit - Cash', 'trans_definition' => 'Deposit to savings/current accounts in the form of cash'],
            ['ca_sa' => 'CDEPK', 'transaction_title' => 'Deposit - Check', 'trans_definition' => 'Deposit to savings/current account in the form of checks (MC/CC/OC)'],
            ['ca_sa' => 'CDEBP', 'transaction_title' => 'Payroll/Pension Account - Debit', 'trans_definition' => 'Debiting of the mother account with payroll/pension service arrangement'],
            ['ca_sa' => 'CDEPS', 'transaction_title' => 'Salaries/Pension- Credit', 'trans_definition' => 'Benefits credited to deposit accounts of the employees/pensioners'],
            ['ca_sa' => 'CRETC', 'transaction_title' => 'Returned Check', 'trans_definition' => 'This refers to a check returned to/by the client or dishonored/found to be defective for certain reasons such as insufficiency of funds and alterations in the document'],
            ['ca_sa' => 'CRETU', 'transaction_title' => 'Returned Check', 'trans_definition' => 'This refers to a check returned to/by the client or dishonored/found to be defective for certain reasons such as insufficiency of funds and alterations in the document'],
            ['ca_sa' => 'CTRIA', 'transaction_title' => 'Inter Account transfer (same)', 'trans_definition' => 'Movement of funds from one account to another client\'s account within the same bank'],
            ['ca_sa' => 'CENC', 'transaction_title' => 'Encashment', 'trans_definition' => 'Check encashment over the counter'],
            ['ca_sa' => 'COCKD', 'transaction_title' => 'On-Us Check Deposit', 'trans_definition' => 'Check that is presented to a bank where the check writer has the funds on the deposit'],
            ['ca_sa' => 'CPDOB', 'transaction_title' => 'Deposit – through other local bank', 'trans_definition' => 'Deposit to client\'s account wherein the actual cash/check is deposited in another local bank'],
            ['ca_sa' => 'CWDLA', 'transaction_title' => 'Withdrawals - ATM', 'trans_definition' => 'Client\'s withdrawal from its deposit account through the ATM'],
            ['ca_sa' => 'CWDLK', 'transaction_title' => 'Withdrawal - through issuance of check', 'trans_definition' => 'Withdrawal from client\'s account wherein proceeds will be released using other bank\'s check'],
            ['ca_sa' => 'CWDLO', 'transaction_title' => 'Withdrawals - OTC', 'trans_definition' => 'Client\'s withdrawal from its deposit account through over the counter'],
            ['ca_sa' => 'CWDOB', 'transaction_title' => 'Withdrawal - through other local bank', 'trans_definition' => 'Withdrawal from client\'s account wherein the actual release of cash is done in another local bank'],

            // Image 2 - Page 2
            ['ca_sa' => 'DTDPC', 'transaction_title' => 'Time Deposit Placement - Cash', 'trans_definition' => 'Placement of time deposit/special deposit/premium deposit/long term deposits, etc. (other than savings/current) in cash'],
            ['ca_sa' => 'DTDPD', 'transaction_title' => 'Time Deposit Placement - Debit Memo', 'trans_definition' => 'Placement of time deposit/special deposit/premium deposit/long term deposits, etc. (other than savings/current) through debit of accountholder\'s account'],
            ['ca_sa' => 'DTDPM', 'transaction_title' => 'Time Deposit Placement - MC/CC', 'trans_definition' => 'Placement of time deposit/special deposit/premium deposit/long term deposits, etc. (other than savings/current) through MC/CC'],
            ['ca_sa' => 'DTDPP', 'transaction_title' => 'Time Deposit Placement-Mixed Payment', 'trans_definition' => 'Placement of time deposit/special deposit/premium deposit/long term deposits, etc. (other than savings/current) in cash savings/current) in two or more pay types (cash, checks, debit from account, wire)'],
            ['ca_sa' => 'DTDRC', 'transaction_title' => 'Time Deposit Pretermination - Cash', 'trans_definition' => 'Pretermination of time deposit/special time deposit/premium time deposit and the like where settlement is made in cash'],
            ['ca_sa' => 'DTDRK', 'transaction_title' => 'Time Deposit Pretermination - Credit Memo', 'trans_definition' => 'Pretermination of time deposit/special time deposit/premium time deposit and the like where settlement proceeds are credited to accountholder\'s account'],
            ['ca_sa' => 'DTDRM', 'transaction_title' => 'Time Deposit Pretermination - MC/CC', 'trans_definition' => 'Pretermination of time deposit/special time deposit/premium time deposit and the like where proceeds are released through manager\'s check/cashier\'s check'],
            ['ca_sa' => 'DTDRO', 'transaction_title' => 'Roll Over of Time Deposit', 'trans_definition' => 'Roll over of time deposit, only if there will be a change in the account number'],
            ['ca_sa' => 'DTDRP', 'transaction_title' => 'Time Deposit Pretermination - Mixed Payment', 'trans_definition' => 'Pretermination of time deposit/special time deposit/premium time deposit and the like where proceeds are paid in two or more pay types (cash, checks, credit to account, wire)'],
            ['ca_sa' => 'DTDYC', 'transaction_title' => 'Time Deposit Payment - Cash', 'trans_definition' => 'Termination of time deposit/special time deposit/premium time deposit and the like where proceeds are paid in cash (other than savings/current)'],
            ['ca_sa' => 'DTDYK', 'transaction_title' => 'Time Deposit Payment - Credit Memo', 'trans_definition' => 'Termination of time deposit/special time deposit/premium time deposit and the like where proceeds are credited to account'],
            ['ca_sa' => 'DTDYM', 'transaction_title' => 'Time Deposit Payment - MC/CC/OC', 'trans_definition' => 'Termination of time deposit/special time deposit/premium time deposit and the like where proceeds are paid in MC/CC/OC'],
            ['ca_sa' => 'DTDYP', 'transaction_title' => 'Time Deposit Payment –Mixed Payment', 'trans_definition' => 'Termination of time deposit/special time deposit/premium time deposit and the like where proceeds are paid in two or more pay types (cash, checks, credit to account, wire)'],

            // Image 3 - Page 3
            ['ca_sa' => 'LARF', 'transaction_title' => 'Foreclosed/Acquired Asset/ROPA', 'trans_definition' => 'This refers to real and other properties, other than those used for banking purposes or held for investment, acquired by the bank in settlement of loans through foreclosure of mortgage in payment and/or any other mode of acquisition'],
            ['ca_sa' => 'LARSP', 'transaction_title' => 'Sale Payment of Asset & ROPA', 'trans_definition' => 'Disposition of bank assets and ROPA either in cash or by installment and includes down payments, reservation fees and amortization.'],
            ['ca_sa' => 'LLNAC', 'transaction_title' => 'Loan Availment (Regular/Foreign Currency Denominated Unit)-Cash', 'trans_definition' => 'Loan availed and released through cash'],
            ['ca_sa' => 'LLNAK', 'transaction_title' => 'Loan Availment (Regular/Foreign Currency Denominated Unit)-Credit Memo', 'trans_definition' => 'Loan availed and released through direct credit to borrower\'s account'],
            ['ca_sa' => 'LLNAM', 'transaction_title' => 'Loan Availment (Regular/Foreign Currency Denominated Unit)- MC/CC/OC', 'trans_definition' => 'Loan availed and released through manager\'s check/cashier\'s check'],
            ['ca_sa' => 'LLNAP', 'transaction_title' => 'Loan Availment (Regular/Foreign Currency Denominated Unit)- Mixed Payment', 'trans_definition' => 'Loan availed and released using two or more pay types (cash, checks, credit to account, wire)'],
            ['ca_sa' => 'LLPRC', 'transaction_title' => 'Loan Payment (Regular/Foreign Currency Denominated Unit)-Cash', 'trans_definition' => 'Payment of loan where settlement is made in cash'],
            ['ca_sa' => 'LLPRD', 'transaction_title' => 'Loan Payment (Regular/Foreign Currency Denominated Unit)-Debit Memo', 'trans_definition' => 'Payment of loan where settlement is made through debit of borrower\'s account'],
            ['ca_sa' => 'LLPRM', 'transaction_title' => 'Loan Payment (Regular/Foreign Currency Denominated Unit)-MC/CC/OC', 'trans_definition' => 'Payment of loan where settlement is made by MC/CC or any other check'],
            ['ca_sa' => 'LLPRP', 'transaction_title' => 'Loan Payment (Regular/Foreign Currency Denominated Unit) - Mixed Payment', 'trans_definition' => 'Payment of loan where settlement is made using two or more pay types (cash, checks, debit from account,wire)'],

            // Image 4 - Page 4
            ['ca_sa' => 'TCSBC', 'transaction_title' => '', 'trans_definition' => ''],
            ['ca_sa' => 'TCSBD', 'transaction_title' => 'Payment', 'trans_definition' => 'Purchase of common shares of other entities by debiting the customer\'s account'],
            ['ca_sa' => 'TCSBM', 'transaction_title' => 'Buy Common Stocks - MC/CC/OC', 'trans_definition' => 'Purchase of common shares of other entities through the issuance of Manager\'s/Cashier\'s check/other check'],
            ['ca_sa' => 'TCSSC', 'transaction_title' => 'Sell Common Stocks - CASH', 'trans_definition' => 'Sale of common shares of other entities in cash'],
            ['ca_sa' => 'TCSSK', 'transaction_title' => 'Sell Common Stocks - Credit Memo', 'trans_definition' => 'Sale of common shares of other entities by crediting accountholder\'s account'],
            ['ca_sa' => 'TCSSM', 'transaction_title' => 'Sell Common Stocks - MC/CC/OC', 'trans_definition' => 'Sale of common shares of other entities through issuance of manager\'s check/cashier\'s check'],
            ['ca_sa' => 'TCSYC', 'transaction_title' => 'Common Stocks Payment - Cash', 'trans_definition' => 'Termination of common shares of other entities in cash'],
            ['ca_sa' => 'TCSYK', 'transaction_title' => 'Common Stocks Payment - Credit Memo', 'trans_definition' => 'Termination of common shares of other entities through credit to accountholder\'s account'],
            ['ca_sa' => 'TCSYM', 'transaction_title' => 'Common Stocks Payment - MC/CC/OC', 'trans_definition' => 'Termination of common shares of other entities though issuance of MC/CC/OC'],
            ['ca_sa' => 'ZST', 'transaction_title' => 'STR transactions', 'trans_definition' => 'STR filed on the basis of suspicious trigger (ex. subject of news report, qualified theft, etc.) even if the subject has no monetary transaction with the covered institution at the time the suspicious activity was determined.'],
        ];

        foreach ($transactionCodes as $code) {
            TransactionCode::create($code);
        }
    }
}
