import React, { useState } from 'react';
import { createTodo } from '../utils/handleApi';
import { useTheme } from '../context/ThemeContext';

const TodoForm = ({ onAddTodo }) => {
  const { isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      alert('Please fill in both title and description');
      return;
    }

    setLoading(true);
    try {
      const newTodo = await createTodo({ title, description, dueDate: dueDate || null, priority });
      onAddTodo(newTodo);
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('Failed to add todo');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 p-7 rounded-2xl shadow-md mb-8 animate-slide-up border border-opacity-10 border-gold font-inter transition-all ${
      isDark ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex flex-col gap-2">
        <label className={`text-xs font-semibold tracking-wider uppercase font-inter ${isDark ? 'text-gray-300' : 'text-brown-light'}`}>📝 Task Title</label>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`px-3.5 py-3 border-2 rounded-xl text-base font-inter transition-all duration-300 ${
            isDark
              ? 'bg-gray-700 border-gold border-opacity-20 text-white placeholder-gray-400 focus:border-gold focus:border-opacity-50 focus:shadow-lg'
              : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-gold focus:shadow-lg focus:bg-white'
          }`}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className={`text-xs font-semibold tracking-wider uppercase font-inter ${isDark ? 'text-gray-300' : 'text-brown-light'}`}>📋 Description</label>
        <textarea
          placeholder="Add more details about your task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`px-3.5 py-3 border-2 rounded-xl text-base font-inter min-h-24 resize-vertical transition-all duration-300 ${
            isDark
              ? 'bg-gray-700 border-gold border-opacity-20 text-white placeholder-gray-400 focus:border-gold focus:border-opacity-50 focus:shadow-lg'
              : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-gold focus:shadow-lg focus:bg-white'
          }`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className={`text-xs font-semibold tracking-wider uppercase font-inter ${isDark ? 'text-gray-300' : 'text-brown-light'}`}>📅 Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`px-3.5 py-3 border-2 rounded-xl text-base font-inter transition-all duration-300 ${
              isDark
                ? 'bg-gray-700 border-gold border-opacity-20 text-white focus:border-gold focus:border-opacity-50 focus:shadow-lg'
                : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-gold focus:shadow-lg focus:bg-white'
            }`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={`text-xs font-semibold tracking-wider uppercase font-inter ${isDark ? 'text-gray-300' : 'text-brown-light'}`}> Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={`px-3.5 py-3 border-2 rounded-xl text-base font-inter transition-all duration-300 ${
              isDark
                ? 'bg-gray-700 border-gold border-opacity-20 text-white focus:border-gold focus:border-opacity-50 focus:shadow-lg'
                : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-gold focus:shadow-lg focus:bg-white'
            }`}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="py-3 bg-gradient-to-br from-gold to-gold px-6 font-space-grotesk text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5"
      >
        {loading ? '⏳ Creating...' : '✨ Add Task'}
      </button>

      <p className={`text-xs font-inter text-center ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>💡 Tip: Press Ctrl+Enter to submit quickly</p>
    </form>
  );
};

export default TodoForm;
