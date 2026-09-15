import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-loader">
      <h1 style={{ marginBottom: 4 }}>Page not found</h1>
      <p className="muted">That page doesn't exist.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 10 }}>
        Back home
      </Link>
    </div>
  );
}
