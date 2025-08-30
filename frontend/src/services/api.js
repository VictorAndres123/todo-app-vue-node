import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  getTasks() {
    return apiClient.get('/tasks');
  },
  createTask(task) {
    return apiClient.post('/tasks', task);
  },
  updateTask(id, updates) {
    return apiClient.put(`/tasks/${id}`, updates);
  },
  deleteTask(id) {
    return apiClient.delete(`/tasks/${id}`);
  }
};
