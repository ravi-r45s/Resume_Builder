import { useEffect, useState } from 'react';
import { fetchUsers, setBuilderAccess } from '../api/admin.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      setUsers(await fetchUsers());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggleAccess(target) {
    setBusyId(target._id);
    setError('');
    try {
      const updated = await setBuilderAccess(target._id, !target.accessGranted);
      setUsers((items) => items.map((item) => (item._id === updated._id ? updated : item)));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId('');
    }
  }

  const pending = users.filter((u) => !u.accessGranted).length;
  const approved = users.length - pending;

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <p className="eyebrow-plain">Admin workspace</p>
          <h1>Access management</h1>
          <p className="muted">Grant or revoke permission to use the ResumeForge builder.</p>
        </div>
        <div className="admin-stats">
          <div><strong>{users.length}</strong><span>Total users</span></div>
          <div><strong>{pending}</strong><span>Pending</span></div>
          <div><strong>{approved}</strong><span>Approved</span></div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="admin-card">
        <div className="admin-card-head">
          <div>
            <h2>Registered users</h2>
            <p className="muted">Only approved users can create, edit, duplicate or download resumes.</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={load} disabled={loading}>Refresh</button>
        </div>

        {loading ? (
          <div className="page-loader" style={{ minHeight: 220 }}><div className="spinner" /></div>
        ) : users.length === 0 ? (
          <div className="admin-empty">No user accounts yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>User</th><th>Email</th><th>Joined</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item._id}>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.email}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`access-badge ${item.accessGranted ? 'approved' : 'pending'}`}>
                        {item.accessGranted ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${item.accessGranted ? 'btn-ghost' : 'btn-primary'}`}
                        onClick={() => toggleAccess(item)}
                        disabled={busyId === item._id}
                      >
                        {busyId === item._id ? 'Saving…' : item.accessGranted ? 'Revoke access' : 'Grant access'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-note">
        <strong>Signed in as {user?.name}</strong>
        <span>Admin accounts always have builder access.</span>
      </div>
    </div>
  );
}
