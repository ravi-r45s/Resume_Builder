import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchResumes, createResume, deleteResume, duplicateResume } from '../api/resumes.js';
import { blankResume } from '../utils/resumeDefaults.js';
import ResumeCard from '../components/ResumeCard.jsx';
import upiQr from '../assets/upi-qr.jpeg';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [showPaymentQr, setShowPaymentQr] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin' || user?.accessGranted) load();
    else setLoading(false);
  }, [user?.role, user?.accessGranted]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchResumes();
      setResumes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    setCreating(true);
    try {
      const resume = await createResume(blankResume());
      navigate(`/editor/${resume._id}`);
    } catch (err) {
      setError(err.message);
      setCreating(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this resume? This cannot be undone.')) return;
    const prev = resumes;
    setResumes((r) => r.filter((x) => x._id !== id));
    try {
      await deleteResume(id);
    } catch (err) {
      setError(err.message);
      setResumes(prev);
    }
  }

  async function handleDuplicate(id) {
    try {
      const copy = await duplicateResume(id);
      setResumes((r) => [copy, ...r]);
    } catch (err) {
      setError(err.message);
    }
  }

  if (user?.role !== 'admin' && !user?.accessGranted) {
    return (
      <div className="access-page">
        <div className="access-card">
          <div className="access-icon">₹</div>

          <p className="eyebrow-plain">ResumeForge Premium Access</p>

          <h1>Get access to ResumeForge</h1>

          <p className="muted">
            Hi {user?.name?.split(' ')[0] || 'there'}, your account has been created.
            Pay ₹99 to activate access to the ResumeForge resume builder.
          </p>

          <button
            type="button"
            className="paymentBtn"
            onClick={() => setShowPaymentQr(true)}
          >
            Pay ₹99 & Unlock ResumeForge
          </button>

          <div className="access-status">
            <span /> Payment & approval pending
          </div>

          <p className="muted small">
            After completing the ₹99 payment, your account will be reviewed and
            access will be activated by the administrator.
          </p>

          <button className="btn btn-ghost" onClick={logout}>
            Log out
          </button>
        </div>
        {showPaymentQr && (
          <div
            className="qr-modal-overlay"
            onClick={() => setShowPaymentQr(false)}
          >
            <div
              className="qr-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="qr-modal-close"
                onClick={() => setShowPaymentQr(false)}
                aria-label="Close"
              >
                ×
              </button>

              <h2>Pay ₹99</h2>

              <p className="muted">
                Scan this QR code with any UPI app
              </p>

              <img
                src={upiQr}
                alt="UPI QR code for ₹99 payment"
              />

              <p className="qr-modal-note">
                After payment, your account will be reviewed and access will be activated.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="dash">
      <div className="dash-head">
        <div>
          <h1>My resumes</h1>
          <p className="muted">Pick one up, or start a new one from scratch.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleCreate} disabled={creating}>
          {creating ? 'Creating…' : '+ New resume'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="page-loader" style={{ minHeight: 200 }}>
          <div className="spinner" />
        </div>
      ) : resumes.length === 0 ? (
        <div className="empty-state">
          <p style={{ marginBottom: 16 }}>You haven't created a resume yet.</p>
          <button type="button" className="btn btn-primary" onClick={handleCreate} disabled={creating}>
            Create your first resume
          </button>
        </div>
      ) : (
        <div className="resume-grid">
          {resumes.map((resume) => (
            <ResumeCard key={resume._id} resume={resume} onDelete={handleDelete} onDuplicate={handleDuplicate} />
          ))}
          <button type="button" className="new-resume-card" onClick={handleCreate} disabled={creating}>
            <span className="plus">+</span>
            New resume
          </button>
        </div>
      )}
    </div>
  );
}
