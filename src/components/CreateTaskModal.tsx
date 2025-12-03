import React from 'react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  newTask: { title: string; description: string };
  setNewTask: React.Dispatch<React.SetStateAction<{ title: string; description: string }>>;
  onSaveTask: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  newTask,
  setNewTask,
  onSaveTask,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Task</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
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
          <button onClick={onSaveTask}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
