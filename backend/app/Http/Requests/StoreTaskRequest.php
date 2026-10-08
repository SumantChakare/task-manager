<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:todo,in-progress,done'],
            'priority' => ['required', 'in:low,medium,high'],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
            'user_id' => ['nullable', 'exists:users,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Task title is required.',
            'status.in' => 'Status must be one of: todo, in-progress, done.',
            'priority.in' => 'Priority must be one of: low, medium, high.',
            'due_date.after_or_equal' => 'Due date cannot be in the past.',
        ];
    }
}
