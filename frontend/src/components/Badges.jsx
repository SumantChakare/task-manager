export function StatusBadge({ status }) {
    const config = {
        todo: { label: 'To Do', className: 'badge-status-todo' },
        'in-progress': { label: 'In Progress', className: 'badge-status-progress' },
        done: { label: 'Done', className: 'badge-status-done' },
    };

    const current = config[status] || { label: status, className: 'badge-status-default' };

    return (
        <span className={`badge ${current.className}`}>
            <span className="badge-dot" />
            {current.label}
        </span>
    );
}

export function PriorityBadge({ priority }) {
    const config = {
        low: { label: 'Low', className: 'badge-priority-low' },
        medium: { label: 'Medium', className: 'badge-priority-medium' },
        high: { label: 'High', className: 'badge-priority-high' },
    };

    const current = config[priority] || { label: priority, className: 'badge-priority-default' };

    return (
        <span className={`badge ${current.className}`}>
            {current.label}
        </span>
    );
}
