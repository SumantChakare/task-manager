import { TaskCard } from './TaskCard';

export function TaskList({
    tasks,
    isLoading,
    error,
    onRetry,
    onEdit,
    onDelete,
    onStatusChange,
    onOpenCreateModal,
}) {
    if (isLoading) {
        return (
            <div className="task-loading-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="task-skeleton-card">
                        <div className="skeleton-row skeleton-badges" />
                        <div className="skeleton-row skeleton-title" />
                        <div className="skeleton-row skeleton-desc" />
                        <div className="skeleton-row skeleton-footer" />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="empty-state-card error-state">
                <div className="empty-icon-circle error-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <h3>Unable to load tasks</h3>
                <p>{error}</p>
                {onRetry && (
                    <button type="button" className="btn btn-secondary mt-3" onClick={onRetry}>
                        Retry Request
                    </button>
                )}
            </div>
        );
    }

    if (!tasks || tasks.length === 0) {
        return (
            <div className="empty-state-card">
                <div className="empty-icon-circle">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                </div>
                <h3>No tasks found</h3>
                <p>There are no tasks matching your current filters. Add a new task to get started.</p>
                <button
                    type="button"
                    className="btn btn-primary mt-3"
                    onClick={onOpenCreateModal}
                >
                    + Create First Task
                </button>
            </div>
        );
    }

    return (
        <div className="task-grid">
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                />
            ))}
        </div>
    );
}
