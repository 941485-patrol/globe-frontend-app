import React from 'react';
import { type Task } from '../types';
import './TaskCardsContainer.css';

interface TaskCardsContainerProps {
  tasks: Task[];
  handleEdit: (task: Task) => void;
  handleDelete: (task: Task) => void;
}

const TaskCardsContainer: React.FC<TaskCardsContainerProps> = ({ tasks, handleEdit, handleDelete }) => {
  return (
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
  );
};

export default TaskCardsContainer;
