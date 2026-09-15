import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/');
  }

  return (
    <header className={`nav ${open ? 'nav-open' : ''}`}>
      <Link to="/" className="nav-brand">
        <span className="nav-mark">R</span>
        ResumeForge
      </Link>
      <button type="button" className="nav-toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span /><span /><span />
      </button>
      <nav className="nav-links" onClick={() => setOpen(false)}>
        {user ? (
          <>
            {user.role === 'admin' ? (
              <Link to="/admin">Admin panel</Link>
            ) : (
              <Link to="/dashboard">My resumes</Link>
            )}
            <span className="nav-user">{user.name}</span>
            <button type="button" className="btn btn-ghost" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Get started
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
