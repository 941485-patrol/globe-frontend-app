import React from 'react';

import type { Task } from '../types';

interface DeleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTask: Task | null;
  onDeleteTask: () => void;
  isOwner: boolean;
}

const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({
  isOpen,
  onClose,
  editingTask,
  onDeleteTask,
  isOwner,
}) => {
  if (!isOpen || !editingTask) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Delete Task</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        {isOwner ? (
          <>
            <p>Are you sure you want to delete this task?</p>
            <div className="modal-actions">
              <button onClick={onDeleteTask}>Delete</button>
              <button onClick={onClose}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p>You cannot delete this task as you are not the owner.</p>
            <div className="modal-actions">
              <button onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteTaskModal;
