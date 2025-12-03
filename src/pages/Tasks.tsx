import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { API_BASE_URL } from '../utils/constants';
import { socket } from '../utils/socket';
import './tasks.css';
import CreateTaskModal from '../components/CreateTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import DeleteTaskModal from '../components/DeleteTaskModal';
import type { Task } from '../types';
import TaskCardsContainer from '../components/TaskCardsContainer';
import PaginationControls from '../components/PaginationControls';

const Tasks: React.FC = () => {
  const { token, logout, userId, userName } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const tasksPerPage = 2; // As per the API response example
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState<string | string[] | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/todo/tasks?page=${currentPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        if (response.status === 500) {
          logout();
          navigate('/login');
          return;
        }
        if (response.status === 401) {
          logout();
          navigate('/login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data.tasks);
      setTotalPages(Math.ceil(data.totalItems / tasksPerPage));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Optionally, handle token expiration or invalid token, e.g., by logging out
      // Specific status code handling (401, 500) is now done in the try block.
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    } else {
      // If no token, redirect to login page
      navigate('/login');
    }
  }, [currentPage, token, logout, navigate]);

  useEffect(() => {
    socket.connect();

    function onTasksEvent(data: { action: string; task: Task }) {
      const { action } = data;
      if (action === 'create' || action === 'update' || action === 'delete') {
        fetchTasks();
      }
    }

    socket.on('tasks', onTasksEvent);

    return () => {
      socket.off('tasks', onTasksEvent);
      socket.disconnect();
    };
  }, [fetchTasks]);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleAddTask = () => {
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setEditingTask(null);
    setError(null);
  };

  const handleSaveTask = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/todo/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        const errorData = await response.json();
         if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.map((err: any) => err.message);
          setError(errorMessages);
        } else {
          setError(errorData.message || 'An unknown error occurred.');
        }
        return;
      }
      
      // After saving, close the modal and refresh the tasks
      handleCloseModal();
      fetchTasks();
      setNewTask({ title: '', description: '' });
      
    } catch (error: any) {
      console.error('Error saving task:', error);
      setError(error.message || 'Network error or server unreachable.');
    }
  };

  const handleEdit = (task: Task) => {
    setError(null);
    setEditingTask(task);
    setIsOwner(task.user._id === userId);
    setIsEditModalOpen(true);
  };

  const handleDelete = (task: Task) => {
    setEditingTask(task);
    setIsOwner(task.user._id === userId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteTask = async () => {
    if (!editingTask) return;

    try {
      const response = await fetch(`${API_BASE_URL}/todo/task/${editingTask._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      handleCloseModal();
      fetchTasks();

    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;

    try {
      const response = await fetch(`${API_BASE_URL}/todo/task/${editingTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editingTask.title,
          description: editingTask.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
         if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.map((err: any) => err.message);
          setError(errorMessages);
        } else {
          setError(errorData.message || 'An unknown error occurred.');
        }
        return;
      }

        handleCloseModal();
        fetchTasks();

    } catch (error: any) {
      console.error('Error updating task:', error);
      setError(error.message || 'Network error or server unreachable.');
    }
  };

  return (
    <div className="tasks-container">
      <h1>Tasks Page</h1>
      <p>Welcome{userName ? `, ${userName}` : ''}! You are logged in.</p>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>

      <div style={{ marginTop: '20px' }}>
        <button className="add-task-btn" onClick={handleAddTask}>Add New Task</button>

        <TaskCardsContainer
          tasks={tasks}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      </div>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        newTask={newTask}
        setNewTask={setNewTask}
        onSaveTask={handleSaveTask}
        error={error}
        clearError={() => setError(null)}
      />

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        onUpdateTask={handleUpdateTask}
        isOwner={isOwner}
        error={error}
        clearError={() => setError(null)}
      />

      <DeleteTaskModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        editingTask={editingTask}
        onDeleteTask={handleDeleteTask}
        isOwner={isOwner}
      />
    </div>
  );
};

export default Tasks;
