<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCtrReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'report_type' => 'required|in:CTR,STR',
            'transaction_type' => 'required|string',
            'submission_date' => 'nullable|date',
            'transactions' => 'required|array',
            'transactions.*.transaction_id' => 'required|exists:ctr_transactions,id',
            'transactions.*.transaction_reference_no' => 'nullable|string',
            'transactions.*.mode_of_transaction_id' => 'nullable|exists:mode_of_transactions,id',
            'transactions.*.transaction_amount' => 'required|numeric|min:0',
            'transactions.*.transaction_code_id' => 'nullable|exists:transaction_codes,id',
            'transactions.*.transaction_date' => 'nullable|date',
            'transactions.*.account_number' => 'nullable|string',
            'transactions.*.parties' => 'required|array',
            'transactions.*.parties.*.party_id' => 'nullable|exists:ctr_parties,id',
            'transactions.*.parties.*.party_flag_id' => 'required|exists:party_flags,id',
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
            'transactions.*.parties.*.customer_reference_no' => 'nullable|string',
            'transactions.*.parties.*.old_acct_no' => 'nullable|string',
            'transactions.*.participating_banks' => 'nullable|array',
            'transactions.*.participating_banks.*.participating_bank_id' => 'nullable|exists:participating_banks,id',
            'transactions.*.participating_banks.*.bank_name' => 'nullable|string',
            'transactions.*.participating_banks.*.account_no' => 'nullable|string',
            'transactions.*.participating_banks.*.amount' => 'nullable|numeric|min:0',
        ];
    }

    /**
     * Get custom validation error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'transactions.required' => 'At least one transaction is required.',
            'transactions.*.transaction_amount.required' => 'Transaction amount is required.',
            'transactions.*.transaction_amount.numeric' => 'Transaction amount must be a valid number.',
            'transactions.*.transaction_amount.min' => 'Transaction amount cannot be negative.',
            'transactions.*.parties.required' => 'At least one party is required.',
            'transactions.*.parties.*.party_flag_id.required' => 'Party flag is required.',
            'transactions.*.parties.*.contact_no.regex' => 'Contact number must be a valid Philippine mobile number (e.g., 09123456789, +639123456789, or +(63) 9123456789).',
        ];
    }
}
