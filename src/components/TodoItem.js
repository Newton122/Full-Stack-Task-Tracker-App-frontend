import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const TodoItem = ({ todo, onToggle, onUpdate, onDelete }) => {
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ? todo.dueDate.split('T')[0] : '');
  const [editPriority, setEditPriority] = useState(todo.priority || 'medium');
  const [loading, setLoading] = useState(false);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-500 text-white border-red-600 shadow-md';
      case 'medium': return 'bg-amber-500 text-white border-amber-600 shadow-md';
      case 'low': return 'bg-green-500 text-white border-green-600 shadow-md';
      default: return 'bg-gray-500 text-white border-gray-600 shadow-md';
    }
  };

  const getPriorityEmoji = (priority) => {
    switch(priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today && !todo.completed;
  };

  const daysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editDescription.trim()) {
      alert('Please fill in both fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/todo/updateToDo/${todo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title: editTitle, 
          description: editDescription,
          dueDate: editDueDate || null,
          priority: editPriority
        })
      });

      if (!response.ok) throw new Error('Failed to update');
      const updatedTodo = await response.json();
      onUpdate(updatedTodo);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/todo/deleteToDo/${todo._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete');
      onDelete(todo._id);
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete task');
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSaveEdit();
    }
  };

  if (isEditing) {
    return (
      <div className="bg-gradient-to-br from-brown-light to-brown-lighter rounded-xl p-5 shadow-md border border-opacity-30 border-gold mb-3 animate-slide-up font-inter">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-opacity-20 border-gold">
          <span className="text-3xl">✏️</span>
          <h3 className="text-xl font-bold text-gold font-space-grotesk">Edit Task</h3>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="px-4 py-3 border-2 border-gold border-opacity-30 rounded-lg text-base font-inter bg-opacity-50 bg-white text-brown-light transition-all duration-300 focus:border-gold focus:border-opacity-70 focus:shadow-lg"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            className="px-4 py-3 border-2 border-gold border-opacity-30 rounded-lg text-base font-inter min-h-20 resize-none bg-opacity-50 bg-white text-brown-light transition-all duration-300 focus:border-gold focus:border-opacity-70 focus:shadow-lg"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="px-4 py-3 border-2 border-gold border-opacity-30 rounded-lg text-base font-inter bg-opacity-50 bg-white text-brown-light transition-all duration-300 focus:border-gold focus:border-opacity-70 focus:shadow-lg"
            />
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="px-4 py-3 border-2 border-gold border-opacity-30 rounded-lg text-base font-inter bg-opacity-50 bg-white text-brown-light transition-all duration-300 focus:border-gold focus:border-opacity-70 focus:shadow-lg"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSaveEdit}
              disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-br from-gold to-gold px-4 text-white border-none rounded-lg font-semibold text-sm cursor-pointer transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 font-inter"
            >
              {loading ? '⏳ Saving...' : '💾 Save Changes'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 py-2.5 border-2 border-gold border-opacity-30 bg-opacity-5 bg-gold text-gold rounded-lg font-semibold text-sm cursor-pointer transition-all duration-300 hover:border-opacity-60 hover:bg-opacity-10 font-inter"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const days = daysUntilDue(todo.dueDate);
  const overdue = isOverdue(todo.dueDate);

  return (
    <div className={`rounded-xl p-5 shadow-md mb-3 animate-slide-up font-inter border-2 transition-all duration-300 ${
      todo.completed
        ? isDark ? 'bg-gray-700 border-opacity-30 border-gold' : 'bg-opacity-5 bg-gold border-opacity-30 border-gold'
        : isDark ? 'bg-gray-800 border-opacity-20 border-gold' : 'bg-white border-opacity-20 border-gold'
    }`}>
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
          className="w-5 h-5 mt-1 cursor-pointer accent-gold"
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`text-lg font-semibold transition-all duration-300 font-space-grotesk ${
              todo.completed ? (isDark ? 'line-through text-gray-500' : 'line-through text-gray-400') : (isDark ? 'text-gold' : 'text-gold')
            }`}>
              {todo.title}
            </h3>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${getPriorityColor(todo.priority)}`}>
              {getPriorityEmoji(todo.priority)} {todo.priority?.toUpperCase() || 'MEDIUM'}
            </span>
          </div>

          <p className={`text-sm transition-all duration-300 font-inter ${
            todo.completed ? (isDark ? 'text-gray-500 line-through' : 'text-gray-400 line-through') : (isDark ? 'text-gray-400' : 'text-gray-600')
          }`}>
            {todo.description}
          </p>

          <div className="flex flex-wrap gap-3 mt-3 text-xs">
            {todo.dueDate && (
              <span className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                overdue 
                  ? isDark ? 'bg-red-900 bg-opacity-40 text-red-300 font-semibold' : 'bg-red-100 text-red-700 font-semibold'
                  : isDark ? 'bg-blue-900 bg-opacity-40 text-blue-300' : 'bg-blue-100 text-blue-700'
              }`}>
                📅 {new Date(todo.dueDate).toLocaleDateString()}
                {days !== null && (
                  <span className={`${days <= 0 ? (isDark ? 'text-red-400' : 'text-red-600') : days <= 3 ? (isDark ? 'text-orange-400' : 'text-orange-600') : (isDark ? 'text-green-400' : 'text-green-600')} font-semibold`}>
                    {overdue ? `⚠️ ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} overdue` : `(${days} day${days !== 1 ? 's' : ''} left)`}
                  </span>
                )}
              </span>
            )}
            {todo.createdAt && (
              <span className={`flex items-center gap-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Created: {new Date(todo.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className={`px-3 py-2 border-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 font-inter ${
              isDark
                ? 'border-gold border-opacity-40 bg-opacity-5 bg-gold text-gold hover:border-opacity-70 hover:bg-opacity-15'
                : 'border-gold border-opacity-40 bg-opacity-5 bg-gold text-gold hover:border-opacity-70 hover:bg-opacity-15'
            } hover:shadow-lg`}
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleDelete}
            className={`px-3 py-2 border-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 font-inter ${
              isDark
                ? 'border-red-600 border-opacity-40 bg-opacity-5 bg-red-600 text-red-400 hover:border-opacity-70 hover:bg-opacity-15'
                : 'border-red-500 border-opacity-40 bg-opacity-5 bg-red-500 text-red-500 hover:border-opacity-70 hover:bg-opacity-15'
            } hover:shadow-lg`}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
