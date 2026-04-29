import React from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiTrash2, FiHeart, FiEdit2 } from 'react-icons/fi';
import '../styles/BookCard.css';

const BookCard = ({
  book,
  onDelete,
  onEdit,
  onDownload,
  onFavoriteToggle,
  isFavorite,
  isOwner,
  showDelete
}) => {
  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this book?')) {
      onDelete(book._id);
    }
  };

  return (
    <Link to={`/read/${book._id}`} className="book-card">
      <div className="book-cover">
        <div className="book-cover-placeholder">
          <span className="cover-icon">📖</span>
        </div>
        <div className="book-overlay">
          <button className="read-btn">Read Online</button>
        </div>
      </div>

      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
        
        <div className="book-meta">
          <span className="downloads">↓ {book.downloads}</span>
          <span className="favorites">♥ {book.favoriteCount}</span>
        </div>

        <div className="book-actions" onClick={(e) => e.preventDefault()}>
          <button
            className={`action-btn favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onFavoriteToggle(book._id);
            }}
            title="Add to favorites"
          >
            <FiHeart />
          </button>

          <button
            className="action-btn download-btn"
            onClick={(e) => {
              e.preventDefault();
              onDownload(book._id, book.fileName);
            }}
            title="Download PDF"
          >
            <FiDownload />
          </button>

          {showDelete && (
            <button
              className="action-btn delete-btn"
              onClick={handleDelete}
              title="Delete book"
            >
              <FiTrash2 />
            </button>
          )}

          {showDelete && (
            <button
              className="action-btn edit-btn"
              onClick={(e) => {
                e.preventDefault();
                onEdit(book._id);
              }}
              title="Edit book"
            >
              <FiEdit2 />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
