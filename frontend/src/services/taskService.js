import { apiRequest } from './api';

export const taskService = {
    /**
     * Retrieve paginated and filtered list of tasks.
     */
    async getTasks({ status = '', search = '', priority = '', userId = '', page = 1, perPage = 10, sortBy = 'created_at', sortOrder = 'desc' } = {}) {
        const params = new URLSearchParams();

        if (status && status !== 'all') {
            params.append('status', status);
        }
        if (priority) {
            params.append('priority', priority);
        }
        if (userId) {
            params.append('user_id', userId);
        }
        if (search) {
            params.append('search', search);
        }
        if (page) {
            params.append('page', page);
        }
        if (perPage) {
            params.append('per_page', perPage);
        }
        if (sortBy) {
            params.append('sort_by', sortBy);
        }
        if (sortOrder) {
            params.append('sort_order', sortOrder);
        }

        const queryString = params.toString();
        const endpoint = `/tasks${queryString ? `?${queryString}` : ''}`;
        return apiRequest(endpoint, { method: 'GET' });
    },

    /**
     * Retrieve single task by ID.
     */
    async getTask(id) {
        return apiRequest(`/tasks/${id}`, { method: 'GET' });
    },

    /**
     * Create a new task.
     */
    async createTask(data) {
        return apiRequest('/tasks', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Update an existing task.
     */
    async updateTask(id, data) {
        return apiRequest(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * Delete a task.
     */
    async deleteTask(id) {
        return apiRequest(`/tasks/${id}`, {
            method: 'DELETE',
        });
    },
};
