import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const SearchFilter = ({ onSearch, onFilterChange }) => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-4 shadow-md mb-6 border-2 transition-all`}>
      <div className="flex gap-2 items-center mb-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-lg border-2 text-sm transition-all ${
              isDark
                ? 'bg-gray-700 border-gold border-opacity-20 text-white placeholder-gray-400 focus:border-gold focus:border-opacity-50'
                : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-gold'
            }`}
          />
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            isDark
              ? 'bg-gold bg-opacity-10 text-gold hover:bg-opacity-20'
              : 'bg-gold bg-opacity-10 text-gold hover:bg-opacity-15'
          }`}
        >
          {showAdvanced ? '📊 Hide' : '📊 Show'} Filters
        </button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-opacity-20 border-gold">
          <select
            onChange={(e) => onFilterChange('priority', e.target.value)}
            className={`px-3 py-2 rounded-lg text-sm border-2 transition-all ${
              isDark
                ? 'bg-gray-700 border-gold border-opacity-20 text-white focus:border-gold focus:border-opacity-50'
                : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-gold'
            }`}
          >
            <option value="">All Priorities</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>

          <select
            onChange={(e) => onFilterChange('status', e.target.value)}
            className={`px-3 py-2 rounded-lg text-sm border-2 transition-all ${
              isDark
                ? 'bg-gray-700 border-gold border-opacity-20 text-white focus:border-gold focus:border-opacity-50'
                : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-gold'
            }`}
          >
            <option value="">All Status</option>
            <option value="completed">✓ Completed</option>
            <option value="pending">⏳ Pending</option>
          </select>

          <select
            onChange={(e) => onFilterChange('dueDate', e.target.value)}
            className={`px-3 py-2 rounded-lg text-sm border-2 transition-all col-span-2 ${
              isDark
                ? 'bg-gray-700 border-gold border-opacity-20 text-white focus:border-gold focus:border-opacity-50'
                : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-gold'
            }`}
          >
            <option value="">All Dates</option>
            <option value="today">📅 Today</option>
            <option value="week">📌 This Week</option>
            <option value="overdue">⚠️ Overdue</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
