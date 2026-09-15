import { Link } from 'react-router-dom';

const TEMPLATE_LABEL = { classic: 'classic', modern: 'modern', minimal: 'minimal' };

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ResumeCard({ resume, onDelete, onDuplicate }) {
  return (
    <div className="resume-card">
      <div className="resume-card-top">
        <h3>
          <Link to={`/editor/${resume._id}`}>{resume.title || 'Untitled resume'}</Link>
        </h3>
        <span className="template-tag">{TEMPLATE_LABEL[resume.template] || 'classic'}</span>
      </div>

      <div className="score-pill">
        <span className="dot" />
        {resume.score ?? 0}/100
      </div>

      <p className="updated">Edited {formatDate(resume.updatedAt)}</p>

      <div className="resume-card-actions">
        <Link to={`/editor/${resume._id}`} className="btn btn-ghost btn-sm">
          Edit
        </Link>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onDuplicate(resume._id)}>
          Duplicate
        </button>
        <button type="button" className="btn btn-sm btn-danger" onClick={() => onDelete(resume._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
