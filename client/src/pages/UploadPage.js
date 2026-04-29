import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '../utils/apiService';
import Toast from '../components/Toast';
import { FiUpload, FiX } from 'react-icons/fi';
import '../styles/UploadPage.css';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f);
    } else {
      setToast({
        type: 'error',
        message: 'Please upload a PDF file'
      });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !title || !author) {
      setToast({
        type: 'error',
        message: 'Please fill in title, author, and upload a PDF'
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('author', author);
    formData.append('description', description);
    formData.append('tags', tags);

    setLoading(true);
    try {
      await bookAPI.uploadBook(formData);
      setToast({
        type: 'success',
        message: 'Book uploaded successfully!'
      });
      setTimeout(() => navigate('/my-books'), 1500);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Upload failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <h1>Upload a PDF Book</h1>
          <p>Share your favorite books with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div
            className={`file-upload ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="upload-icon">
              <FiUpload size={48} />
            </div>
            <h3>Drag and drop your PDF</h3>
            <p>or</p>
            <label className="file-input-label">
              <span>Browse files</span>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFile(e.target.files[0])}
                disabled={loading}
              />
            </label>
            {file && (
              <p className="file-name">
                ✓ {file.name}
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="remove-file"
                >
                  <FiX />
                </button>
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="title">Book Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              disabled={loading}
              maxLength="200"
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Author *</label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
              disabled={loading}
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter book description"
              disabled={loading}
              maxLength="1000"
              rows="4"
            />
            <small>{description.length}/1000</small>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., fiction, adventure, classic"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading || !file}
          >
            {loading ? 'Uploading...' : 'Upload Book'}
          </button>
        </form>
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

export default UploadPage;
