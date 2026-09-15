import api from './axios.js';

export const fetchResumes = () => api.get('/resumes').then((res) => res.data);

export const fetchResume = (id) => api.get(`/resumes/${id}`).then((res) => res.data);

export const createResume = (payload) => api.post('/resumes', payload).then((res) => res.data);

export const updateResume = (id, payload) =>
  api.put(`/resumes/${id}`, payload).then((res) => res.data);

export const deleteResume = (id) => api.delete(`/resumes/${id}`);

export const duplicateResume = (id) => api.post(`/resumes/${id}/duplicate`).then((res) => res.data);
