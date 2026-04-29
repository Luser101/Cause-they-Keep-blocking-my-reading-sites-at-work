import api from './api';

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateTheme: (darkMode) => api.put('/auth/theme', { darkMode })
};

// Book APIs
export const bookAPI = {
  getBooks: (params) => api.get('/books', { params }),
  getTopBooks: () => api.get('/books/top'),
  getUserBooks: (params) => api.get('/books/my-books', { params }),
  getBookById: (id) => api.get(`/books/${id}`),
  uploadBook: (formData) => api.post('/books', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateBook: (id, data) => api.put(`/books/${id}`, data),
  deleteBook: (id) => api.delete(`/books/${id}`),
  downloadBook: (id) => api.get(`/books/${id}/download`, { responseType: 'blob' })
};

// User APIs
export const userAPI = {
  addFavorite: (bookId) => api.post('/user/favorites', { bookId }),
  removeFavorite: (bookId) => api.delete(`/user/favorites/${bookId}`),
  getUserFavorites: (params) => api.get('/user/favorites', { params }),
  isFavorite: (bookId) => api.get(`/user/favorites/${bookId}/check`),
  addBookmark: (data) => api.post('/user/bookmarks', data),
  getBookmarks: (bookId) => api.get(`/user/bookmarks/${bookId}`),
  deleteBookmark: (id) => api.delete(`/user/bookmarks/${id}`),
  saveReadingProgress: (data) => api.post('/user/progress', data),
  getReadingProgress: (bookId) => api.get(`/user/progress/${bookId}`)
};
