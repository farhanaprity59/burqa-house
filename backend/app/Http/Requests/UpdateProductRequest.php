<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'             => 'sometimes|required|string|max:255',
            'description'      => 'nullable|string',
            'base_price'       => 'sometimes|required|numeric|min:0.01',
            'category'         => 'nullable|string|max:100',
            'is_active'        => 'boolean',

            'variants'         => 'nullable|array',
            'variants.*.id'    => 'nullable|integer|exists:product_variants,id',
            'variants.*.size'  => 'nullable|string|max:50',
            'variants.*.color' => 'nullable|string|max:50',
            'variants.*.sku'   => [
                'required_with:variants',
                'string',
                'max:100',
            ],
            'variants.*.price' => 'required_with:variants|numeric|min:0.01',
            'variants.*.stock' => 'required_with:variants|integer|min:0',
        ];
    }

    /**
     * Get custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'base_price.min'       => 'The base price must be at least 0.01.',
            'variants.*.price.min' => 'Each variant price must be at least 0.01.',
            'variants.*.stock.min' => 'Stock cannot be negative.',
        ];
    }
}
