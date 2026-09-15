import { useAuth } from '../context/AuthContext.jsx';

export default function AccessPending() {
  const { user, logout } = useAuth();
  return (
    <div className="access-page">
      <div className="access-card">
        <div className="access-icon">✓</div>
        <p className="eyebrow-plain">Account created</p>
        <h1>Waiting for approval</h1>
        <p className="muted">
          Hi {user?.name?.split(' ')[0] || 'there'}, your account is ready. An administrator needs to grant
          you access before you can use the resume builder.
        </p>
        <div className="access-status"><span /> Access request pending</div>
        <p className="muted small">You can log out and come back later. Once approved, your normal dashboard will open automatically.</p>
        <button className="btn btn-ghost" onClick={logout}>Log out</button>
      </div>
    </div>
  );
}
