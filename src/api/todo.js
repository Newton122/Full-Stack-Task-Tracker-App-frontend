import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const TODO_URL = `${API_URL}`; // we will append path segments in each call

export const getTodos = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${TODO_URL}/getToDo`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const addTodo = async (todo) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${TODO_URL}/saveToDo`, todo, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateTodo = async (id, updates) => {
  const token = localStorage.getItem('token');
  const res = await axios.put(`${TODO_URL}/updateToDo/${id}`, updates, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteTodo = async (id) => {
  const token = localStorage.getItem('token');
  const res = await axios.delete(`${TODO_URL}/deleteToDo/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};