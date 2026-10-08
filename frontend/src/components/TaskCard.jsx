import { StatusBadge, PriorityBadge } from './Badges';

export function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
    // Check if task is overdue
    const isOverdue = (() => {
        if (!task.due_date || task.status === 'done') return false;
        const due = new Date(task.due_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return due < today;
    })();

    const formattedDueDate = task.due_date
        ? new Date(task.due_date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          })
        : null;

    return (
        <div className={`task-card ${task.status === 'done' ? 'task-card-done' : ''} ${isOverdue ? 'task-card-overdue' : ''}`}>
            <div className="task-card-header">
                <div className="task-badges">
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                </div>
                <div className="task-actions">
                    <button
                        type="button"
                        className="btn-icon"
                        title="Edit Task"
                        onClick={() => onEdit(task)}
                        aria-label="Edit task"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        className="btn-icon btn-icon-danger"
                        title="Delete Task"
                        onClick={() => onDelete(task)}
                        aria-label="Delete task"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                    </button>
                </div>
            </div>

            <h3 className="task-card-title">{task.title}</h3>

            {task.description && (
                <p className="task-card-desc">{task.description}</p>
            )}

            <div className="task-card-footer">
                <div className="task-meta">
                    {formattedDueDate && (
                        <div className={`task-due-date ${isOverdue ? 'overdue-text' : ''}`}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span>{formattedDueDate}</span>
                            {isOverdue && <span className="overdue-tag">Overdue</span>}
                        </div>
                    )}
                    {task.user && (
                        <div className="task-owner" title={`Assigned to ${task.user.name}`}>
                            <span className="owner-avatar">
                                {task.user.name ? task.user.name.charAt(0).toUpperCase() : 'U'}
                            </span>
                            <span className="owner-name">{task.user.name}</span>
                        </div>
                    )}
                </div>

                {/* Quick Status Toggle */}
                <div className="status-quick-select">
                    <label htmlFor={`status-select-${task.id}`} className="sr-only">Change Status</label>
                    <select
                        id={`status-select-${task.id}`}
                        className="status-dropdown"
                        value={task.status}
                        onChange={(e) => onStatusChange(task, e.target.value)}
                    >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
