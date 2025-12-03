import React from 'react';
import ErrorMessage from './ErrorMessage';

import type { Task } from '../types';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTask: Task | null;
  setEditingTask: React.Dispatch<React.SetStateAction<Task | null>>;
  onUpdateTask: () => void;
  isOwner: boolean;
  error: string | string[] | null;
  clearError: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  editingTask,
  setEditingTask,
  onUpdateTask,
  isOwner,
  error,
  clearError,
}) => {
  if (!isOpen || !editingTask) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Task</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <ErrorMessage message={error} onClose={clearError} />
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
          {isOwner && <button onClick={onUpdateTask}>Update</button>}
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
