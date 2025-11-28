<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionsRequest extends FormRequest
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
        ];
    }
}
