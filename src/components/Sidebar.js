import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ tasks, onProjectSelect, onTagSelect, onSubtaskAdd }) => {
  const { isDark } = useTheme();
  const [expanded, setExpanded] = useState({});
  const [newProject, setNewProject] = useState('');
  const [newTag, setNewTag] = useState('');
  const [projects, setProjects] = useState([...new Set(tasks.map(t => t.project || 'Uncategorized'))]);
  const [tags, setTags] = useState([...new Set(tasks.flatMap(t => t.tags || []))]);

  const toggleExpand = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const addProject = () => {
    if (newProject.trim() && !projects.includes(newProject.trim())) {
      setProjects([...projects, newProject.trim()]);
      setNewProject('');
    }
  };

  const deleteProject = (project) => {
    setProjects(projects.filter(p => p !== project));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const deleteTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const SectionHeader = ({ title, emoji, section }) => (
    <button
      onClick={() => toggleExpand(section)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
        isDark
          ? 'hover:bg-gold hover:bg-opacity-10 text-gold'
          : 'hover:bg-gold hover:bg-opacity-5 text-gold'
      }`}
    >
      <span className="flex items-center gap-2">
        {emoji} {title}
      </span>
      <span className={`transition-transform ${expanded[section] ? 'rotate-180' : ''}`}>▼</span>
    </button>
  );

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gold'} rounded-xl shadow-md border-2 p-4 max-h-96 overflow-y-auto transition-all`}>
      <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-gold' : 'text-gold'}`}>📂 Task Manager</h3>

      {/* Projects Section */}
      <div className="mb-4">
        <SectionHeader title="Projects" emoji="📁" section="projects" />
        {expanded.projects && (
          <div className="mt-2 ml-2 space-y-2 border-l-2 border-opacity-20 border-gold pl-3">
            {projects.length === 0 ? (
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No projects yet</p>
            ) : (
              projects.map((project, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => onProjectSelect(project)}
                    className={`flex-1 text-left px-3 py-2 rounded text-sm transition-all ${
                      isDark
                        ? 'hover:bg-gold hover:bg-opacity-10 text-gray-300'
                        : 'hover:bg-gold hover:bg-opacity-5 text-gray-700'
                    }`}
                  >
                    📁 {project}
                  </button>
                  <button
                    onClick={() => deleteProject(project)}
                    className={`px-2 py-1 rounded text-xs transition-all ${
                      isDark
                        ? 'hover:bg-red-900 hover:bg-opacity-40 text-red-400'
                        : 'hover:bg-red-100 text-red-600'
                    }`}
                    title="Delete project"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
            <div className="flex gap-1 mt-2">
              <input
                type="text"
                placeholder="Add new..."
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addProject()}
                className={`flex-1 px-2 py-1.5 rounded text-xs border-2 ${
                  isDark
                    ? 'bg-gray-700 border-gold border-opacity-20 text-white placeholder-gray-400'
                    : 'bg-white border-gold border-opacity-20 text-gray-800 placeholder-gray-400'
                }`}
              />
              <button
                onClick={addProject}
                className={`px-2 py-1.5 rounded text-xs font-semibold transition-all ${
                  isDark
                    ? 'bg-gold bg-opacity-20 text-gold hover:bg-opacity-30'
                    : 'bg-gold bg-opacity-10 text-gold hover:bg-opacity-20'
                }`}
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tags Section */}
      <div className="mb-4">
        <SectionHeader title="Tags" emoji="🏷️" section="tags" />
        {expanded.tags && (
          <div className="mt-2 ml-2 space-y-2 border-l-2 border-opacity-20 border-gold pl-3">
            {tags.length === 0 ? (
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No tags yet</p>
            ) : (
              tags.map((tag, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => onTagSelect(tag)}
                    className={`flex-1 text-left px-3 py-2 rounded text-sm transition-all ${
                      isDark
                        ? 'hover:bg-gold hover:bg-opacity-10 text-gray-300'
                        : 'hover:bg-gold hover:bg-opacity-5 text-gray-700'
                    }`}
                  >
                    🏷️ {tag}
                  </button>
                  <button
                    onClick={() => deleteTag(tag)}
                    className={`px-2 py-1 rounded text-xs transition-all ${
                      isDark
                        ? 'hover:bg-red-900 hover:bg-opacity-40 text-red-400'
                        : 'hover:bg-red-100 text-red-600'
                    }`}
                    title="Delete tag"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
            <div className="flex gap-1 mt-2">
              <input
                type="text"
                placeholder="Add new..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className={`flex-1 px-2 py-1.5 rounded text-xs border-2 ${
                  isDark
                    ? 'bg-gray-700 border-gold border-opacity-20 text-white placeholder-gray-400'
                    : 'bg-white border-gold border-opacity-20 text-gray-800 placeholder-gray-400'
                }`}
              />
              <button
                onClick={addTag}
                className={`px-2 py-1.5 rounded text-xs font-semibold transition-all ${
                  isDark
                    ? 'bg-gold bg-opacity-20 text-gold hover:bg-opacity-30'
                    : 'bg-gold bg-opacity-10 text-gold hover:bg-opacity-20'
                }`}
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="mb-4">
        <SectionHeader title="Notes" emoji="📝" section="notes" />
        {expanded.notes && (
          <div className={`mt-2 ml-2 p-3 rounded-lg text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            <p className="mb-2"> Add notes to tasks by clicking the edit button!</p>
            <textarea
              placeholder="Quick notes..."
              className={`w-full px-2 py-1.5 rounded text-xs border-2 ${
                isDark
                  ? 'bg-gray-600 border-gold border-opacity-20 text-white placeholder-gray-400'
                  : 'bg-white border-gold border-opacity-20 text-gray-800 placeholder-gray-400'
              }`}
              rows="3"
            />
          </div>
        )}
      </div>

      {/* Subtasks Section */}
      <div>
        <SectionHeader title="Subtasks" emoji="✓" section="subtasks" />
        {expanded.subtasks && (
          <div className={`mt-2 ml-2 p-3 rounded-lg text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            <p className="mb-2">✨ Subtasks coming soon! Break tasks into smaller steps.</p>
            <div className="space-y-1">
              <input
                type="text"
                placeholder="Add subtask..."
                disabled
                className={`w-full px-2 py-1.5 rounded text-xs border-2 ${
                  isDark
                    ? 'bg-gray-600 border-gold border-opacity-20 text-white placeholder-gray-400'
                    : 'bg-white border-gold border-opacity-20 text-gray-800 placeholder-gray-400'
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
