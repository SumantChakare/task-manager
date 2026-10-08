import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { taskService } from './services/taskService';
import { authService } from './services/authService';
import { Navbar } from './components/Navbar';
import { TaskFilterBar } from './components/TaskFilterBar';
import { TaskList } from './components/TaskList';
import { Pagination } from './components/Pagination';
import { TaskModal } from './components/TaskModal';
import { ConfirmModal } from './components/ConfirmModal';
import { AuthModal } from './components/AuthModal';
import { LandingHero } from './components/LandingHero';
import { Toast } from './components/Toast';
import './App.css';

function App() {
    const { user, isAuthenticated, isAdmin, isLoading: isAuthLoading } = useAuth();

    // Tasks and pagination state
    const [tasks, setTasks] = useState([]);
    const [meta, setMeta] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Filter and query state
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [sortOption, setSortOption] = useState('created_at-desc');
    const [currentPage, setCurrentPage] = useState(1);

    // Admin Users Directory (for owner filtering and assignment)
    const [usersList, setUsersList] = useState([]);

    // Modal states
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Auth Modal state
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState('login');

    const handleOpenAuthModal = (mode = 'login') => {
        setAuthModalMode(mode);
        setIsAuthModalOpen(true);
    };

    // Feedback Toast state
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    // Parse sort option
    const [sortBy, sortOrder] = sortOption.split('-');

    // Fetch tasks from API (protected by Sanctum token)
    const loadTasks = useCallback(async () => {
        if (!isAuthenticated) {
            setTasks([]);
            setMeta(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await taskService.getTasks({
                status: statusFilter,
                search: searchQuery,
                priority: priorityFilter,
                userId: isAdmin ? selectedUserId : '',
                page: currentPage,
                perPage: 9,
                sortBy,
                sortOrder,
            });

            setTasks(response.data || []);
            setMeta(response.meta || null);
        } catch (err) {
            console.error('Failed to load tasks:', err);
            if (err.status === 401) {
                setError('Your session has expired. Please sign in again.');
                setIsAuthModalOpen(true);
            } else if (err.status === 403) {
                setError('Forbidden: You do not have permission to view these tasks.');
            } else {
                setError(err.message || 'Unable to connect to the backend API.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, statusFilter, searchQuery, priorityFilter, selectedUserId, currentPage, sortBy, sortOrder, isAdmin]);

    // Fetch tasks whenever auth status or filters change
    useEffect(() => {
        if (!isAuthLoading) {
            loadTasks();
        }
    }, [isAuthLoading, loadTasks]);

    // If Admin, load users list for owner filtering
    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            authService.getUsers()
                .then((users) => setUsersList(users))
                .catch((err) => console.warn('Failed to fetch users list:', err));
        } else {
            setUsersList([]);
            setSelectedUserId('');
        }
    }, [isAuthenticated, isAdmin]);

    // Filter change handlers that reset to page 1
    const handleStatusChange = (newStatus) => {
        setStatusFilter(newStatus);
        setCurrentPage(1);
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handlePriorityChange = (priority) => {
        setPriorityFilter(priority);
        setCurrentPage(1);
    };

    const handleUserChange = (userId) => {
        setSelectedUserId(userId);
        setCurrentPage(1);
    };

    const handleSortChange = (newSort) => {
        setSortOption(newSort);
        setCurrentPage(1);
    };

    // Create / Edit modal triggers
    const handleOpenCreateModal = () => {
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
            return;
        }
        setEditingTask(null);
        setIsTaskModalOpen(true);
    };

    const handleOpenEditModal = (task) => {
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
            return;
        }
        setEditingTask(task);
        setIsTaskModalOpen(true);
    };

    const handleCloseTaskModal = () => {
        setIsTaskModalOpen(false);
        setEditingTask(null);
    };

    const handleSaveTask = async (formData) => {
        setIsSaving(true);
        try {
            if (editingTask) {
                await taskService.updateTask(editingTask.id, formData);
                showToast('Task updated successfully!', 'success');
            } else {
                await taskService.createTask(formData);
                showToast('Task created successfully!', 'success');
            }
            setIsTaskModalOpen(false);
            setEditingTask(null);
            loadTasks();
        } catch (err) {
            console.error('Failed to save task:', err);
            if (err.status === 403) {
                showToast(err.message || 'Forbidden: You cannot modify this task.', 'error');
            }
            throw err;
        } finally {
            setIsSaving(false);
        }
    };

    // Quick status toggle directly from card
    const handleQuickStatusChange = async (task, newStatus) => {
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
            return;
        }

        if (task.status === newStatus) return;

        const originalStatus = task.status;
        setTasks((prev) =>
            prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
        );

        try {
            await taskService.updateTask(task.id, { status: newStatus });
            showToast(`Task status changed to "${newStatus}"`, 'success');
        } catch (err) {
            console.error('Failed to change status:', err);
            setTasks((prev) =>
                prev.map((t) => (t.id === task.id ? { ...t, status: originalStatus } : t))
            );
            showToast(err.message || 'Failed to update status', 'error');
        }
    };

    // Delete modal triggers
    const handleOpenDeleteModal = (task) => {
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
            return;
        }
        setTaskToDelete(task);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setTaskToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!taskToDelete) return;

        setIsDeleting(true);
        try {
            await taskService.deleteTask(taskToDelete.id);
            showToast('Task deleted successfully.', 'success');
            handleCloseDeleteModal();
            loadTasks();
        } catch (err) {
            console.error('Failed to delete task:', err);
            showToast(err.message || 'Failed to delete task.', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    if (isAuthLoading) {
        return (
            <div className="auth-loading-screen">
                <div className="spinner-border spinner-lg" />
                <p>Verifying authentication session...</p>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Navbar
                onOpenCreateModal={handleOpenCreateModal}
                onOpenAuthModal={() => handleOpenAuthModal('login')}
            />

            <main className="main-content">
                <div className="content-container">
                    {/* Admin Banner */}
                    {isAuthenticated && isAdmin && (
                        <div className="admin-banner-notice">
                            <div className="admin-banner-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <div className="admin-banner-text">
                                <strong>Admin Privileges Active:</strong> You can view, edit, reassign, and delete tasks across all users.
                            </div>
                        </div>
                    )}

                    {/* Unauthenticated Landing Hero */}
                    {!isAuthenticated ? (
                        <LandingHero
                            onOpenAuthModal={handleOpenAuthModal}
                            onQuickLoginSuccess={(msg) => showToast(msg, 'success')}
                        />
                    ) : (
                        <>
                            {/* Filter & Search Bar */}
                            <TaskFilterBar
                                selectedStatus={statusFilter}
                                onStatusChange={handleStatusChange}
                                searchQuery={searchQuery}
                                onSearchChange={handleSearchChange}
                                selectedPriority={priorityFilter}
                                onPriorityChange={handlePriorityChange}
                                sortBy={sortOption}
                                onSortChange={handleSortChange}
                                isAdmin={isAdmin}
                                usersList={usersList}
                                selectedUserId={selectedUserId}
                                onUserChange={handleUserChange}
                            />

                            {/* Task Grid / Cards List */}
                            <TaskList
                                tasks={tasks}
                                isLoading={isLoading}
                                error={error}
                                onRetry={loadTasks}
                                onEdit={handleOpenEditModal}
                                onDelete={handleOpenDeleteModal}
                                onStatusChange={handleQuickStatusChange}
                                onOpenCreateModal={handleOpenCreateModal}
                            />

                            {/* Pagination Controls */}
                            <Pagination
                                meta={meta}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        </>
                    )}
                </div>
            </main>

            {/* Modals & Dialogs */}
            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={handleCloseTaskModal}
                onSave={handleSaveTask}
                task={editingTask}
                isSaving={isSaving}
                isAdmin={isAdmin}
                usersList={usersList}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Delete Task"
                message={`Are you sure you want to permanently delete "${taskToDelete?.title}"?`}
                isProcessing={isDeleting}
            />

            {/* Auth Modal (Login / Register) */}
            <AuthModal
                isOpen={isAuthModalOpen}
                initialMode={authModalMode}
                onClose={() => setIsAuthModalOpen(false)}
            />

            {/* Global Toast Notification */}
            <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
    );
}

export default App;