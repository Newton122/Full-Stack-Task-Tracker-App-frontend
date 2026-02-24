import React from 'react';

const FilterButtons = ({ todos, filterStatus, onFilterChange }) => {
  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = todos.filter(t => !t.completed).length;

  const styles = {
    container: {
      display: 'flex',
      gap: '12px',
      marginBottom: '30px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    button: {
      padding: '8px 16px',
      background: 'rgba(255, 255, 255, 0.15)',
      color: 'white',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '25px',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)'
    },
    activeButton: {
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#667eea',
      borderColor: 'white',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
    }
  };

  const filterOptions = [
    { name: 'all', label: `All (${todos.length})` },
    { name: 'pending', label: `Pending (${pendingCount})` },
    { name: 'completed', label: `Completed (${completedCount})` }
  ];

  return (
    <div style={styles.container}>
      {filterOptions.map(option => (
        <button
          key={option.name}
          onClick={() => onFilterChange(option.name)}
          style={{
            ...styles.button,
            ...(filterStatus === option.name && styles.activeButton)
          }}
          onMouseEnter={(e) => {
            if (filterStatus !== option.name) {
              e.target.style.background = 'rgba(255, 255, 255, 0.25)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              e.target.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (filterStatus !== option.name) {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
