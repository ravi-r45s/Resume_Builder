import api from './axios.js';

export const fetchUsers = () => api.get('/admin/users').then((res) => res.data);

export const setBuilderAccess = (userId, accessGranted) =>
  api.patch(`/admin/users/${userId}/access`, { accessGranted }).then((res) => res.data);
