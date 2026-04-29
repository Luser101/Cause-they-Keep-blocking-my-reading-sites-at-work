import React, { useState, useEffect } from 'react';
import { bookAPI, userAPI } from '../utils/apiService';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';
import '../styles/LibraryPage.css';

const LibraryPage = () => {
  const [books, setBooks] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({ search: '', author: '' });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [favorites, setFavorites] = useState(new Set());
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchBooks();
    fetchTopBooks();
  }, [filters, page]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await bookAPI.getBooks({
        ...filters,
        page,
        limit: 12
      });
      setBooks(response.data.books);
      setPagination(response.data.pagination);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to load books'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTopBooks = async () => {
    try {
      const response = await bookAPI.getTopBooks();
      setTopBooks(response.data.books);
    } catch (error) {
      console.error('Failed to load top books:', error);
    }
  };

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleFavoriteToggle = async (bookId) => {
    if (!isAuthenticated) {
      setToast({ type: 'error', message: 'Please login to add favorites' });
      return;
    }

    try {
      if (favorites.has(bookId)) {
        await userAPI.removeFavorite(bookId);
        setFavorites(new Set([...favorites].filter(id => id !== bookId)));
        setToast({ type: 'success', message: 'Removed from favorites' });
      } else {
        await userAPI.addFavorite(bookId);
        setFavorites(new Set([...favorites, bookId]));
        setToast({ type: 'success', message: 'Added to favorites' });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update favorite'
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
      setToast({ type: 'success', message: 'Download started' });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to download book'
      });
    }
  };

  return (
    <div className="library-page">
      <div className="hero-section">
        <h1>Welcome to PDF Library Hub</h1>
        <p>Discover, read, and manage your favorite PDF books online</p>
      </div>

      {topBooks.length > 0 && (
        <section className="featured-section">
          <h2>Featured Books</h2>
          <div className="featured-grid">
            {topBooks.slice(0, 3).map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onFavoriteToggle={handleFavoriteToggle}
                onDownload={handleDownload}
                isFavorite={favorites.has(book._id)}
                isOwner={false}
                showDelete={false}
              />
            ))}
          </div>
        </section>
      )}

      <section className="library-section">
        <div className="library-header">
          <h2>All Books</h2>
          <SearchBar
            onSearch={handleSearch}
            loading={loading}
          />
        </div>

        {loading && page === 1 ? (
          <Loading />
        ) : books.length === 0 ? (
          <div className="no-books">
            <p>No books found. Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="books-grid">
              {books.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  onFavoriteToggle={handleFavoriteToggle}
                  onDownload={handleDownload}
                  isFavorite={favorites.has(book._id)}
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
      </section>

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

export default LibraryPage;
