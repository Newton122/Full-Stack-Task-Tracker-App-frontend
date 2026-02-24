import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import FilterButtons from '../components/FilterButtons';
import SearchFilter from '../components/SearchFilter';
import Sidebar from '../components/Sidebar';

const API_URL = process.env.REACT_APP_API_URL || 'https://taskmind-backend-wjsv.onrender.com';

export default function Dashboard({ onLogout }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const applyFilters = useCallback(() => {
    let result = todos;

    // Search filter
    if (searchTerm) {
      result = result.filter(todo =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus === 'completed') {
      result = result.filter(t => t.completed);
    } else if (filterStatus === 'pending') {
      result = result.filter(t => !t.completed);
    }

    // Priority filter
    if (filters.priority && filters.priority !== '') {
      result = result.filter(t => t.priority === filters.priority);
    }

    // Status filter from advanced
    if (filters.status && filters.status !== '') {
      if (filters.status === 'completed') {
        result = result.filter(t => t.completed);
      } else if (filters.status === 'pending') {
        result = result.filter(t => !t.completed);
      }
    }

    // Due date filter
    if (filters.dueDate && filters.dueDate !== '') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      result = result.filter(t => {
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate);
        due.setHours(0, 0, 0, 0);

        if (filters.dueDate === 'today') {
          return due.getTime() === today.getTime();
        } else if (filters.dueDate === 'week') {
          const week = new Date(today);
          week.setDate(week.getDate() + 7);
          return due >= today && due <= week;
        } else if (filters.dueDate === 'overdue') {
          return due < today && !t.completed;
        }
        return true;
      });
    }

    setFilteredTodos(result);
  }, [todos, filterStatus, searchTerm, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/todo/getToDo`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = (newTodo) => {
    setTodos([...todos, newTodo]);
  };

  const handleUpdateTodo = (updatedTodo) => {
    setTodos(todos.map(todo => todo._id === updatedTodo._id ? updatedTodo : todo));
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo._id !== id));
  };

  const handleToggleTodo = async (todo) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/todo/updateToDo/${todo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !todo.completed })
      });

      if (!response.ok) throw new Error('Failed to update todo');
      const updatedTodo = await response.json();
      handleUpdateTodo(updatedTodo);
    } catch (error) {
      console.error('Error toggling todo:', error);
      alert('Failed to update task');
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    completionRate: todos.length > 0 ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) : 0
  };

  return (
    <div className={`min-h-screen transition-all ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-brown-dark via-brown-light to-brown-lighter'} p-4 font-inter relative overflow-hidden`}>
      {/* Navigation */}
      <nav className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-opacity-10 bg-gold border-opacity-25 border-gold'} backdrop-blur-md rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6 shadow-lg border animate-slide-down transition-all`}>
        <div className="flex items-center gap-1.5 sm:gap-3">
          <h1 className={`text-base sm:text-lg font-bold m-0 drop-shadow-md font-space-grotesk ${isDark ? 'text-gold' : 'text-gold'}`}>🎲 TaskMind</h1>
          <div className={`text-xs sm:text-xs font-medium font-inter hidden sm:block ${isDark ? 'text-gray-300' : 'text-gold-dark'}`}>👤 {user?.username || user?.email}</div>
        </div>
        <div className="flex gap-0 sm:gap-1.5 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          <button
            onClick={toggleTheme}
            className={`px-1 sm:px-2.5 py-0.5 sm:py-1.5 border-[0.5px] rounded text-xs sm:text-xs font-semibold transition-all duration-300 flex items-center gap-0 sm:gap-1 flex-1 sm:flex-none justify-center ${
              isDark
                ? 'border-gold border-opacity-40 bg-opacity-5 bg-gold text-gold hover:bg-opacity-15'
                : 'border-opacity-40 border-gold bg-opacity-5 bg-gold text-gold hover:bg-opacity-15 shadow-sm'
            } hover:-translate-y-0.5 hover:shadow-lg`}
          >
            <span className="text-xs sm:text-base">{isDark ? '☀️' : '🌙'}</span>
            <span className="hidden sm:inline">Theme</span>
          </button>
          <button
            onClick={() => setShowStats(!showStats)}
            className={`px-1 sm:px-2.5 py-0.5 sm:py-1.5 border-[0.5px] rounded text-xs sm:text-xs font-semibold transition-all duration-300 flex items-center gap-0 sm:gap-1 flex-1 sm:flex-none justify-center ${
              isDark
                ? 'border-gold border-opacity-40 bg-opacity-5 bg-gold text-gold hover:bg-opacity-15'
                : 'border-opacity-40 border-gold bg-opacity-5 bg-gold text-gold hover:bg-opacity-15 shadow-sm'
            } hover:-translate-y-0.5 hover:shadow-lg`}
          >
            <span className="text-xs sm:text-sm">📊</span>
            <span className="hidden sm:inline">Stats</span>
          </button>
          <button
            onClick={handleLogout}
            className={`px-1 sm:px-2.5 py-0.5 sm:py-1.5 border-[0.5px] rounded text-xs sm:text-xs font-semibold transition-all duration-300 flex items-center gap-0 sm:gap-1 flex-1 sm:flex-none justify-center ${
              isDark
                ? 'border-red-500 border-opacity-40 bg-opacity-5 bg-red-500 text-red-400 hover:bg-opacity-15 hover:border-opacity-60'
                : 'border-opacity-40 border-gold bg-opacity-5 bg-gold text-gold hover:bg-red-500 hover:bg-opacity-15 hover:border-red-500 hover:border-opacity-50 hover:text-red-500 shadow-sm'
            } hover:-translate-y-0.5 hover:shadow-lg`}
          >
            <span className="text-xs sm:text-sm">🚪</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* Stats */}
      {showStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 mb-2 sm:mb-6 justify-center animate-slide-up\">
          {[
            { icon: '📋', value: stats.total, label: 'Total Tasks' },
            { icon: '✓', value: stats.completed, label: 'Completed' },
            { icon: '⏳', value: stats.pending, label: 'Pending' },
            { icon: '🎯', value: `${stats.completionRate}%`, label: 'Completion Rate' }
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`rounded-md p-1 sm:p-2.5 shadow-sm border flex flex-col justify-center items-center aspect-square cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                isDark
                  ? 'bg-gray-800 border-opacity-20 border-gold hover:border-opacity-40'
                  : 'bg-gradient-to-br from-brown-light to-brown-lighter border-opacity-20 border-gold hover:border-opacity-40'
              }`}
            >
              <div className="text-base sm:text-2xl mb-0">{stat.icon}</div>
              <div className={`text-xs sm:text-sm font-bold drop-shadow-sm font-inter ${isDark ? 'text-gold' : 'text-gold'}`}>{stat.value}</div>
              <div className={`text-xs sm:text-xs font-medium font-inter text-center line-clamp-2 leading-tight ${isDark ? 'text-gray-400' : 'text-gold-darker'}`}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4\">
        {/* Sidebar */}
        {showSidebar && (
          <div className="md:col-span-1">
            <button
              onClick={() => setShowSidebar(false)}
              className={`w-full mb-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isDark
                  ? 'bg-gray-800 text-gold border border-gold border-opacity-20 hover:border-opacity-40'
                  : 'bg-gold bg-opacity-10 text-gold border border-gold border-opacity-20 hover:border-opacity-40 shadow-sm'
              }`}
            >
              Hide Sidebar
            </button>
            <Sidebar tasks={todos} onProjectSelect={() => {}} onTagSelect={() => {}} onSubtaskAdd={() => {}} />
          </div>
        )}

        {/* Main Content */}
        <div className={`${showSidebar ? 'md:col-span-3' : 'md:col-span-4'}`}>
          {!showSidebar && (
            <button
              onClick={() => setShowSidebar(true)}
              className={`mb-4 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isDark
                  ? 'bg-gray-800 text-gold border border-gold border-opacity-20 hover:border-opacity-40'
                  : 'bg-gold bg-opacity-10 text-gold border border-gold border-opacity-20 hover:border-opacity-40 shadow-sm'
              }`}
            >
              📂 Show Sidebar
            </button>
          )}

          {/* Hero Section */}
          <div className={`text-center mb-10 animate-slide-down rounded-2xl p-8 border shadow-lg transition-all ${
            isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-opacity-10 border-gold'
          }`}>
            <h2 className={`text-4xl font-bold m-0 mb-3 font-space-grotesk ${isDark ? 'text-gold' : 'text-gold'}`}>Manage Your Tasks</h2>
            <p className={`text-base opacity-80 m-0 font-inter font-medium ${isDark ? 'text-gray-300' : 'text-gold-dark'}`}>Create, organize and track your daily goals with ease</p>
          </div>

          {/* Search and Filter */}
          <SearchFilter onSearch={handleSearch} onFilterChange={handleFilterChange} />

          {/* Add Task Form */}
          <TodoForm onAddTodo={handleAddTodo} />

          {/* Filter Buttons */}
          <FilterButtons todos={todos} filterStatus={filterStatus} onFilterChange={setFilterStatus} />

          {/* Tasks List */}
          {loading ? (
            <div className={`text-center text-base mt-8 mb-8 font-inter ${isDark ? 'text-gold' : 'text-gold'}`}>⏳ Loading your tasks...</div>
          ) : filteredTodos.length === 0 ? (
            <div className={`text-center py-16 px-5 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white bg-opacity-10 border border-gold border-opacity-20'}`}>
              <div className="text-7xl mb-4 animate-float">📭</div>
              <p className={`text-2xl font-bold mb-2 ${isDark ? 'text-gold' : 'text-gold'}`}>No Tasks Yet!</p>
              <p className={`text-base mb-4 ${isDark ? 'text-gray-300' : 'text-gold-dark'}`}>Your task list is empty. Start by creating your first task!</p>
              <p className={`text-sm opacity-70 ${isDark ? 'text-gray-400' : 'text-gold-darker'}`}>👇 Use the form above to add a new task</p>
            </div>
          ) : (
            <TodoList
              todos={filteredTodos}
              filterStatus={filterStatus}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
              onToggle={handleToggleTodo}
            />
          )}
        </div>
      </div>

      {/* Floating Cube */}
      <div className="floating-cube">
        <div className="cube">
          <div className="cube-face">🎲</div>
          <div className="cube-face">✓</div>
          <div className="cube-face">🔐</div>
          <div className="cube-face">📧</div>
          <div className="cube-face">✨</div>
          <div className="cube-face">🚀</div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rotateCube {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-40px); }
        }
        .floating-cube {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          animation: float 6s ease-in-out infinite;
          perspective: 1000px;
          z-index: 999;
        }
        .cube {
          width: 100%;
          height: 100%;
          position: relative;
          animation: rotateCube 8s linear infinite;
          transform-style: preserve-3d;
        }
        .cube-face {
          position: absolute;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          opacity: 0.9;
          border: 2px solid rgba(212, 175, 55, 0.3);
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(184, 134, 11, 0.1));
          backdrop-filter: blur(10px);
          border-radius: 8px;
        }
        .cube-face:nth-child(1) { transform: translateZ(30px); }
        .cube-face:nth-child(2) { transform: rotateY(180deg) translateZ(30px); }
        .cube-face:nth-child(3) { transform: rotateY(90deg) translateZ(30px); }
        .cube-face:nth-child(4) { transform: rotateY(-90deg) translateZ(30px); }
        .cube-face:nth-child(5) { transform: rotateX(90deg) translateZ(30px); }
        .cube-face:nth-child(6) { transform: rotateX(-90deg) translateZ(30px); }
        input:focus, textarea:focus {
          outline: none !important;
          border-color: #ffd700 !important;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.15) !important;
        }
        @media (max-width: 768px) {
          .floating-cube { width: 50px; height: 50px; bottom: 20px; right: 20px; }
          .cube-face { width: 50px; height: 50px; font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
