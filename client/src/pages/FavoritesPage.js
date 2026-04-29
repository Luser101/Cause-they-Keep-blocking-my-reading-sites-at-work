import React, { useState, useEffect } from 'react';
import { userAPI, bookAPI } from '../utils/apiService';
import BookCard from '../components/BookCard';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import '../styles/LibraryPage.css';

const FavoritesPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchFavorites();
  }, [page]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getUserFavorites({
        page,
        limit: 12
      });
      setBooks(response.data.books);
      setPagination(response.data.pagination);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to load favorites'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (bookId) => {
    try {
      await userAPI.removeFavorite(bookId);
      setBooks(books.filter(b => b._id !== bookId));
      setToast({
        type: 'success',
        message: 'Removed from favorites'
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to remove favorite'
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
        <h1>My Favorites</h1>
        <p>Your favorite books collection</p>
      </div>

      {loading && page === 1 ? (
        <Loading />
      ) : books.length === 0 ? (
        <div className="no-books">
          <p>You don't have any favorite books yet.</p>
          <a href="/" className="btn btn-primary">Browse Library</a>
        </div>
      ) : (
        <>
          <div className="books-grid">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onDelete={handleRemoveFavorite}
                onDownload={handleDownload}
                onFavoriteToggle={handleRemoveFavorite}
                isFavorite={true}
                isOwner={false}
                showDelete={false}
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

export default FavoritesPage;
