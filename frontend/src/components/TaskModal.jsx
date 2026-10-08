import { useState, useEffect } from 'react';
import { DatePicker } from './DatePicker';

export function TaskModal({
    isOpen,
    onClose,
    onSave,
    task = null,
    isSaving = false,
    isAdmin = false,
    usersList = [],
}) {
    const isEditMode = Boolean(task);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        due_date: '',
        user_id: '',
    });

    const [errors, setErrors] = useState({});

    // Populate or reset form whenever modal opens or task changes
    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'todo',
                priority: task.priority || 'medium',
                due_date: task.due_date ? task.due_date.substring(0, 10) : '',
                user_id: task.user_id || '',
            });
        } else {
            setFormData({
                title: '',
                description: '',
                status: 'todo',
                priority: 'medium',
                due_date: '',
                user_id: '',
            });
        }
        setErrors({});
    }, [task, isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        const nextErrors = {};
        if (!formData.title.trim()) {
            nextErrors.title = 'Title is required.';
        } else if (formData.title.length > 255) {
            nextErrors.title = 'Title cannot exceed 255 characters.';
        }

        if (!['todo', 'in-progress', 'done'].includes(formData.status)) {
            nextErrors.status = 'Please choose a valid status.';
        }

        if (!['low', 'medium', 'high'].includes(formData.priority)) {
            nextErrors.priority = 'Please choose a valid priority.';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            // Strip empty user_id if not chosen
            const payload = { ...formData };
            if (!payload.user_id) {
                delete payload.user_id;
            }
            await onSave(payload);
        } catch (err) {
            if (err.errors) {
                const backendErrors = {};
                for (const [key, msgs] of Object.entries(err.errors)) {
                    backendErrors[key] = Array.isArray(msgs) ? msgs[0] : msgs;
                }
                setErrors(backendErrors);
            }
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isEditMode ? 'Edit Task' : 'Create New Task'}</h2>
                    <button type="button" className="btn-close" onClick={onClose} aria-label="Close dialog">
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="modal-body">
                        {/* Title input */}
                        <div className="form-group">
                            <label htmlFor="task-title">
                                Task Title <span className="req">*</span>
                            </label>
                            <input
                                id="task-title"
                                type="text"
                                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                placeholder="e.g., Integrate payment gateway"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                autoFocus
                            />
                            {errors.title && <span className="field-error">{errors.title}</span>}
                        </div>

                        {/* Description textarea */}
                        <div className="form-group">
                            <label htmlFor="task-desc">Description</label>
                            <textarea
                                id="task-desc"
                                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                rows="3"
                                placeholder="Add optional details, acceptance criteria, or notes..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                            {errors.description && <span className="field-error">{errors.description}</span>}
                        </div>

                        {/* Status & Priority Grid */}
                        <div className="form-row">
                            <div className="form-group col">
                                <label htmlFor="task-status">
                                    Status <span className="req">*</span>
                                </label>
                                <select
                                    id="task-status"
                                    className={`form-control ${errors.status ? 'is-invalid' : ''}`}
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="todo">To Do</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                                {errors.status && <span className="field-error">{errors.status}</span>}
                            </div>

                            <div className="form-group col">
                                <label htmlFor="task-priority">
                                    Priority <span className="req">*</span>
                                </label>
                                <select
                                    id="task-priority"
                                    className={`form-control ${errors.priority ? 'is-invalid' : ''}`}
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                                {errors.priority && <span className="field-error">{errors.priority}</span>}
                            </div>
                        </div>

                        {/* Due Date & Optional Admin Owner Assignment */}
                        <div className="form-row">
                            <div className="form-group col">
                                <label htmlFor="task-due-date">Due Date</label>
                                <DatePicker
                                    id="task-due-date"
                                    value={formData.due_date}
                                    onChange={(selectedDate) => setFormData({ ...formData, due_date: selectedDate })}
                                    isInvalid={Boolean(errors.due_date)}
                                />
                                {errors.due_date && <span className="field-error">{errors.due_date}</span>}
                            </div>

                            {isAdmin && usersList.length > 0 && (
                                <div className="form-group col">
                                    <label htmlFor="task-owner-select">Assign Owner (Admin)</label>
                                    <select
                                        id="task-owner-select"
                                        className="form-control"
                                        value={formData.user_id}
                                        onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                                    >
                                        <option value="">Current User (Default)</option>
                                        {usersList.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.name} ({u.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSaving}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <span className="spinner-border" /> Saving...
                                </>
                            ) : isEditMode ? (
                                'Save Changes'
                            ) : (
                                'Create Task'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
