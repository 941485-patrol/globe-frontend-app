import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { API_BASE_URL } from '../utils/constants';
import { socket } from '../utils/socket';
import './tasks.css';

interface Task {
  _id: string;
  title: string;
  description: string;
  user: {
    _id: string,
    name: string
  };
}

const Tasks: React.FC = () => {
  const { token, logout, userId } = useAuth();
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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setEditingTask(null);
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // After saving, close the modal and refresh the tasks
      handleCloseModal();
      fetchTasks();
      setNewTask({ title: '', description: '' });

    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleEdit = (task: Task) => {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      handleCloseModal();
      fetchTasks();

    } catch (error) {
      console.error('Error updating task:', error);
    }
  };


  return (
    <div className="tasks-container">
      <h1>Tasks Page</h1>
      <p>Welcome! You are logged in.</p>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>

      <div style={{ marginTop: '20px' }}>
        <button className="add-task-btn" onClick={handleAddTask}>Add New Task</button>
        <div className="tasks-cards-container">
          {tasks.map((task) => (
            <div key={task._id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className="crud-buttons">
                <button className="edit-btn" onClick={() => handleEdit(task)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(task)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Task</h2>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            <input
              type="text"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={handleSaveTask}>Save</button>
              <button onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && editingTask && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Task</h2>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            <input
              type="text"
              placeholder="Title"
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              disabled={!isOwner}
            />
            <textarea
              placeholder="Description"
              value={editingTask.description}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              disabled={!isOwner}
            />
            <div className="modal-actions">
              {isOwner && <button onClick={handleUpdateTask}>Update</button>}
              <button onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && editingTask && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Task</h2>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            {isOwner ? (
              <>
                <p>Are you sure you want to delete this task?</p>
                <div className="modal-actions">
                  <button onClick={handleDeleteTask}>Delete</button>
                  <button onClick={handleCloseModal}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p>You cannot delete this task as you are not the owner.</p>
                <div className="modal-actions">
                  <button onClick={handleCloseModal}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
