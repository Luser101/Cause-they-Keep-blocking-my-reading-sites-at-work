import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { bookAPI, userAPI } from '../utils/apiService';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import { FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut, FiDownload, FiBookmark } from 'react-icons/fi';
import '../styles/PDFReader.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFReaderPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);
  const [toast, setToast] = useState(null);
  const [showBookmarks, setShowBookmarks] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await bookAPI.getBookById(id);
        setBook(response.data.book);

        // Try to get last read page
        try {
          const progressResponse = await userAPI.getReadingProgress(id);
          setPageNumber(progressResponse.data.page || 1);
        } catch (e) {
          console.log('Could not load reading progress');
        }

        // Fetch bookmarks
        try {
          const bookmarksResponse = await userAPI.getBookmarks(id);
          setBookmarks(bookmarksResponse.data.bookmarks);
        } catch (e) {
          console.log('Could not load bookmarks');
        }
      } catch (error) {
        setToast({
          type: 'error',
          message: 'Failed to load book'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePageChange = async (newPage) => {
    if (newPage > 0 && newPage <= numPages) {
      setPageNumber(newPage);
      // Save reading progress
      try {
        await userAPI.saveReadingProgress({
          bookId: id,
          page: newPage
        });
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }
  };

  const handleAddBookmark = async () => {
    try {
      const note = prompt('Add a note for this bookmark (optional):');
      const response = await userAPI.addBookmark({
        bookId: id,
        page: pageNumber,
        note: note || ''
      });
      setBookmarks([...bookmarks.filter(b => b.page !== pageNumber), response.data.bookmark]);
      setToast({
        type: 'success',
        message: 'Bookmark added'
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to add bookmark'
      });
    }
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    try {
      await userAPI.deleteBookmark(bookmarkId);
      setBookmarks(bookmarks.filter(b => b._id !== bookmarkId));
      setToast({
        type: 'success',
        message: 'Bookmark deleted'
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to delete bookmark'
      });
    }
  };

  const handleDownload = async () => {
    try {
      const response = await bookAPI.downloadBook(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', book.fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to download'
      });
    }
  };

  if (loading) return <Loading />;
  if (!book) return <div className="error">Book not found</div>;

  const isPageBookmarked = bookmarks.some(b => b.page === pageNumber);

  return (
    <div className="pdf-reader-container">
      <div className="reader-header">
        <div className="book-info">
          <h1>{book.title}</h1>
          <p>by {book.author}</p>
        </div>
        <div className="reader-controls">
          <button
            className={`control-btn ${isPageBookmarked ? 'active' : ''}`}
            onClick={handleAddBookmark}
            title="Add bookmark"
          >
            <FiBookmark />
          </button>
          <button
            className="control-btn"
            onClick={() => setShowBookmarks(!showBookmarks)}
            title="Show bookmarks"
          >
            📑 {bookmarks.length}
          </button>
          <button
            className="control-btn"
            onClick={handleDownload}
            title="Download PDF"
          >
            <FiDownload />
          </button>
        </div>
      </div>

      <div className="reader-content">
        {showBookmarks && (
          <aside className="bookmarks-sidebar">
            <h3>Bookmarks</h3>
            {bookmarks.length === 0 ? (
              <p className="no-bookmarks">No bookmarks yet</p>
            ) : (
              <ul className="bookmarks-list">
                {bookmarks.map((bookmark) => (
                  <li key={bookmark._id}>
                    <div
                      className="bookmark-item"
                      onClick={() => handlePageChange(bookmark.page)}
                    >
                      <span className="bookmark-page">Page {bookmark.page}</span>
                      {bookmark.note && <p>{bookmark.note}</p>}
                    </div>
                    <button
                      onClick={() => handleDeleteBookmark(bookmark._id)}
                      className="delete-bookmark"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        )}

        <div className="pdf-viewer">
          <Document
            file={book.filePath}
            onLoadSuccess={handleDocumentLoadSuccess}
            loading={<Loading />}
          >
            <Page pageNumber={pageNumber} scale={scale} />
          </Document>
        </div>
      </div>

      <div className="reader-footer">
        <div className="zoom-controls">
          <button
            className="zoom-btn"
            onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
            title="Zoom out"
          >
            <FiZoomOut />
          </button>
          <span className="zoom-level">{Math.round(scale * 100)}%</span>
          <button
            className="zoom-btn"
            onClick={() => setScale(s => Math.min(3, s + 0.1))}
            title="Zoom in"
          >
            <FiZoomIn />
          </button>
        </div>

        <div className="navigation-controls">
          <button
            className="nav-btn"
            onClick={() => handlePageChange(pageNumber - 1)}
            disabled={pageNumber === 1}
          >
            <FiChevronLeft /> Previous
          </button>

          <div className="page-input">
            <input
              type="number"
              min="1"
              max={numPages}
              value={pageNumber}
              onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
            />
            <span>/ {numPages}</span>
          </div>

          <button
            className="nav-btn"
            onClick={() => handlePageChange(pageNumber + 1)}
            disabled={pageNumber === numPages}
          >
            Next <FiChevronRight />
          </button>
        </div>
      </div>

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

export default PDFReaderPage;
