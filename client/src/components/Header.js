import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiLogOut, FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import '../styles/Header.css';

const Header = () => {
  const { user, logout, darkMode, toggleDarkMode, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">PDF Library Hub</span>
        </Link>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li><Link to="/">Library</Link></li>
            {isAuthenticated && <li><Link to="/my-books">My Books</Link></li>}
            {isAuthenticated && <li><Link to="/favorites">Favorites</Link></li>}
            {isAuthenticated && <li><Link to="/upload">Upload</Link></li>}
          </ul>
        </nav>

        <div className="header-actions">
          <button className="theme-btn" onClick={toggleDarkMode} title="Toggle dark mode">
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>

          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">{user?.name}</span>
              <button
                className="logout-btn"
                onClick={() => {
                  logout();
                  window.location.href = '/';
                }}
              >
                <FiLogOut /> Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
