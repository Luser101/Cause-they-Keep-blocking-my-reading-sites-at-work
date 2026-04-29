import React, { useState, useEffect } from 'react';
import { bookAPI, userAPI } from '../utils/apiService';
import BookCard from '../components/BookCard';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import '../styles/LibraryPage.css';

const MyBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchBooks();
  }, [page]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await bookAPI.getUserBooks({
        page,
        limit: 12
      });
      setBooks(response.data.books);
      setPagination(response.data.pagination);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to load your books'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    try {
      await bookAPI.deleteBook(bookId);
      setBooks(books.filter(b => b._id !== bookId));
      setToast({
        type: 'success',
        message: 'Book deleted successfully'
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to delete book'
      });
    }
  };

  const handleEdit = (book) => {
    setEditingId(book._id);
    setEditData({
      title: book.title,
      author: book.author,
      description: book.description,
      tags: book.tags.join(', ')
    });
  };

  const handleSaveEdit = async (bookId) => {
    try {
      await bookAPI.updateBook(bookId, {
        ...editData,
        tags: editData.tags
      });
      setBooks(books.map(b =>
        b._id === bookId
          ? {
              ...b,
              title: editData.title,
              author: editData.author,
              description: editData.description,
              tags: editData.tags.split(',').map(t => t.trim())
            }
          : b
      ));
      setEditingId(null);
      setToast({
        type: 'success',
        message: 'Book updated successfully'
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to update book'
      });
    }
  };

  const handleDownload = async (bookId, fileName) => {
    try {
      const response = await bookAPI.downloadBook(bookId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to download book'
      });
    }
  };

  return (
    <div className="library-page">
      <div className="library-header">
        <h1>My Books</h1>
        <p>Manage your uploaded books</p>
      </div>

      {loading && page === 1 ? (
        <Loading />
      ) : books.length === 0 ? (
        <div className="no-books">
          <p>You haven't uploaded any books yet.</p>
          <a href="/upload" className="btn btn-primary">Upload Your First Book</a>
        </div>
      ) : (
        <>
          {editingId && (
            <div className="edit-modal">
              <div className="edit-form">
                <h2>Edit Book</h2>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Author</label>
                  <input
                    value={editData.author}
                    onChange={(e) => setEditData({ ...editData, author: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Tags (comma-separated)</label>
                  <input
                    value={editData.tags}
                    onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
                  />
                </div>
                <div className="modal-actions">
                  <button onClick={() => handleSaveEdit(editingId)} className="btn btn-primary">
                    Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="books-grid">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onDownload={handleDownload}
                onFavoriteToggle={() => {}}
                isFavorite={false}
                isOwner={true}
                showDelete={true}
              />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="page-btn"
              >
                Previous
              </button>
              <span className="page-info">
                Page {pagination.current} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="page-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default MyBooksPage;
