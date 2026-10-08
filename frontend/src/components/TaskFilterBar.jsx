export function TaskFilterBar({
    selectedStatus,
    onStatusChange,
    searchQuery,
    onSearchChange,
    selectedPriority,
    onPriorityChange,
    sortBy,
    onSortChange,
    isAdmin = false,
    usersList = [],
    selectedUserId = '',
    onUserChange,
}) {
    const statusTabs = [
        { id: 'all', label: 'All Tasks' },
        { id: 'todo', label: 'To Do' },
        { id: 'in-progress', label: 'In Progress' },
        { id: 'done', label: 'Done' },
    ];

    return (
        <div className="filter-bar-wrapper">
            <div className="status-tabs-row">
                <div className="status-tabs">
                    {statusTabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            className={`status-tab ${selectedStatus === tab.id ? 'active' : ''}`}
                            onClick={() => onStatusChange(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="filter-controls-row">
                {/* Search input */}
                <div className="search-input-wrapper">
                    <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search tasks by title or description..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            className="search-clear-btn"
                            onClick={() => onSearchChange('')}
                            aria-label="Clear search"
                        >
                            &times;
                        </button>
                    )}
                </div>

                {/* Admin-only: Owner filter */}
                {isAdmin && usersList.length > 0 && (
                    <div className="select-control-wrapper">
                        <select
                            className="select-input admin-owner-select"
                            value={selectedUserId}
                            onChange={(e) => onUserChange && onUserChange(e.target.value)}
                            aria-label="Filter by task owner"
                        >
                            <option value="">All Owners (All Users)</option>
                            {usersList.map((u) => (
                                <option key={u.id} value={u.id}>
                                    👤 {u.name} ({u.role})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Priority filter */}
                <div className="select-control-wrapper">
                    <select
                        className="select-input"
                        value={selectedPriority}
                        onChange={(e) => onPriorityChange(e.target.value)}
                        aria-label="Filter by priority"
                    >
                        <option value="">All Priorities</option>
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                    </select>
                </div>

                {/* Sort selector */}
                <div className="select-control-wrapper">
                    <select
                        className="select-input"
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        aria-label="Sort tasks by"
                    >
                        <option value="created_at-desc">Newest First</option>
                        <option value="created_at-asc">Oldest First</option>
                        <option value="due_date-asc">Due Date (Earliest)</option>
                        <option value="due_date-desc">Due Date (Latest)</option>
                        <option value="title-asc">Title (A-Z)</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
