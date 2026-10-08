<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of tasks with role-based scoping, filtering, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Task::with('user:id,name,email,role');

        // Role-based scoping: Admins see all tasks; Users see only their own tasks
        if ($user->isAdmin()) {
            // Admins can optionally filter tasks by a specific owner
            if ($request->filled('user_id')) {
                $query->where('user_id', $request->user_id);
            }
        } else {
            $query->where('user_id', $user->id);
        }

        // Filter by status (todo, in-progress, done)
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by priority (low, medium, high)
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        // Search in title and description
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sorting
        $allowedSorts = ['id', 'title', 'status', 'priority', 'due_date', 'created_at'];
        $sortBy = in_array($request->get('sort_by'), $allowedSorts, true) ? $request->get('sort_by') : 'created_at';
        $sortOrder = strtolower((string) $request->get('sort_order')) === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = max(1, min(100, (int) $request->get('per_page', 9)));
        $paginated = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $paginated->items(),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
            'message' => 'Tasks retrieved successfully',
        ], 200);
    }

    /**
     * Store a newly created task in storage.
     */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        $data = $request->validated();
        $user = $request->user();

        // If admin specifies a different user_id, allow it; otherwise assign to authenticated user
        if ($user->isAdmin() && ! empty($data['user_id'])) {
            $data['user_id'] = $data['user_id'];
        } else {
            $data['user_id'] = $user->id;
        }

        $task = Task::create($data);
        $task->load('user:id,name,email,role');

        return response()->json([
            'success' => true,
            'data' => $task,
            'message' => 'Task created successfully',
        ], 201);
    }

    /**
     * Display the specified task (403 if regular user tries to view someone else's task).
     */
    public function show(Request $request, Task $task): JsonResponse
    {
        $user = $request->user();

        if (! $user->isAdmin() && $task->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden: You do not have permission to view this task.',
            ], 403);
        }

        $task->load('user:id,name,email,role');

        return response()->json([
            'success' => true,
            'data' => $task,
            'message' => 'Task details retrieved successfully',
        ], 200);
    }

    /**
     * Update the specified task (403 if regular user tries to update someone else's task).
     */
    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $user = $request->user();

        if (! $user->isAdmin() && $task->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden: You do not have permission to modify this task.',
            ], 403);
        }

        $task->update($request->validated());
        $task->load('user:id,name,email,role');

        return response()->json([
            'success' => true,
            'data' => $task,
            'message' => 'Task updated successfully',
        ], 200);
    }

    /**
     * Remove the specified task (403 if regular user tries to delete someone else's task).
     */
    public function destroy(Request $request, Task $task): JsonResponse
    {
        $user = $request->user();

        if (! $user->isAdmin() && $task->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden: You do not have permission to delete this task.',
            ], 403);
        }

        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully',
        ], 200);
    }
}
