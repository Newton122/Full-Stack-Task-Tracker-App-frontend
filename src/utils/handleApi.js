const API_URL = process.env.REACT_APP_API_URL || 'https://taskmind-backend-wjsv.onrender.com';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export async function getTodos() {
  const res = await fetch(`${API_URL}/api/todo/getToDo`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
}

export async function createTodo(payload) {
  const res = await fetch(`${API_URL}/api/todo/saveToDo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create todo');
  return res.json();
}

export async function updateTodo(id, updates) {
  const res = await fetch(`${API_URL}/api/todo/updateToDo/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update todo');
  return res.json();
}

export async function deleteTodo(id) {
  const res = await fetch(`${API_URL}/api/todo/deleteToDo/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });
  if (!res.ok) throw new Error('Failed to delete todo');
  return res.json();
}
