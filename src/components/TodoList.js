import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, filterStatus, onUpdate, onDelete, onToggle }) => {
  const filteredTodos = todos.filter(todo => {
    if (filterStatus === 'completed') return todo.completed;
    if (filterStatus === 'pending') return !todo.completed;
    return true;
  });

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      animation: 'fadeIn 0.6s ease-out'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: 'rgba(255, 255, 255, 0.8)',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '15px',
      border: '2px dashed rgba(255, 255, 255, 0.2)'
    },
    emptyTitle: {
      fontSize: '1.2rem',
      margin: '10px 0'
    },
    emptyMessage: {
      fontSize: '0.95rem',
      opacity: 0.8,
      margin: '10px 0 0 0'
    }
  };

  if (filteredTodos.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p style={styles.emptyTitle}>📭 No todos yet</p>
        <p style={styles.emptyMessage}>Create your first todo to get started!</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

export default TodoList;
