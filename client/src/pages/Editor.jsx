import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchResume, updateResume } from '../api/resumes.js';
import RepeatSection from '../components/RepeatSection.jsx';
import ResumePreview from '../components/ResumePreview.jsx';
import ScoreMeter from '../components/ScoreMeter.jsx';
import { computeScore, uid, blankEducation, blankExperience, blankProject, blankCertification } from '../utils/resumeDefaults.js';
import { demoResume } from '../utils/demoData.js';

const TEMPLATES = [
  { id: 'classic', label: 'Classic', note: 'Timeless & balanced' },
  { id: 'modern', label: 'Modern', note: 'Professional sidebar' },
  { id: 'minimal', label: 'Minimal', note: 'Clean & quiet' },
  { id: 'executive', label: 'Executive', note: 'Leadership focused' },
  { id: 'elegant', label: 'Elegant', note: 'Refined & polished' },
  { id: 'creative', label: 'Creative', note: 'Distinctive sidebar' },
  { id: 'tech', label: 'Tech', note: 'Developer friendly' },
  { id: 'ats', label: 'ATS Pro', note: 'Recruiter friendly' },
  { id: 'academic', label: 'Academic', note: 'Research ready' },
  { id: 'compact', label: 'Compact', note: 'More content, less space' },
  { id: 'bold', label: 'Bold', note: 'Strong visual hierarchy' },
  { id: 'corporate', label: 'Corporate', note: 'Classic business' },
  { id: 'swiss', label: 'Swiss', note: 'Grid & precision' },
  { id: 'editorial', label: 'Editorial', note: 'Magazine inspired' },
  { id: 'startup', label: 'Startup', note: 'Modern & energetic' },
  { id: 'timeline', label: 'Timeline', note: 'Career journey' },
  { id: 'sidebar', label: 'Profile', note: 'Strong profile panel' },
  { id: 'monochrome', label: 'Mono', note: 'Pure black & white' },
  { id: 'fresh', label: 'Fresh', note: 'Light & contemporary' },
  { id: 'luxe', label: 'Luxe', note: 'Premium feel' },
];

function withIds(list) {
  return (list || []).map((item) => (item.id ? item : { ...item, id: uid() }));
}

export default function Editor() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [skillsInput, setSkillsInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved | error
  const saveTimer = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchResume(id);
        if (cancelled) return;
        data.education = withIds(data.education);
        data.experience = withIds(data.experience);
        data.projects = withIds(data.projects);
        data.certifications = withIds(data.certifications);
        setResume(data);
        setSkillsInput((data.skills || []).join(', '));
        setError('');
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [id]);

  const scheduleSave = useCallback(
    (next) => {
      setSaveState('saving');
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        try {
          const saved = await updateResume(id, next);
          setSaveState('saved');
          setResume((r) => (r ? { ...r, score: saved.score, updatedAt: saved.updatedAt } : r));
        } catch (err) {
          setSaveState('error');
          setError(err.message);
        }
      }, 700);
    },
    [id]
  );

  function patch(updates) {
    setResume((prev) => {
      const next = { ...prev, ...updates };
      scheduleSave(next);
      return next;
    });
  }

  function handleSkillsChange(e) {
    const value = e.target.value;
    setSkillsInput(value);
    const skills = value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    patch({ skills });
  }

  function handlePersonalChange(field) {
    return (e) => patch({ personal: { ...(resume.personal || {}), [field]: e.target.value } });
  }

  function handlePrint() {
    window.print();
  }

  function handleLoadDemo() {
    if (!window.confirm('Load demo content? This will replace your current details.')) return;
    const demo = demoResume();
    demo.education = withIds(demo.education);
    demo.experience = withIds(demo.experience);
    demo.projects = withIds(demo.projects);
    demo.certifications = withIds(demo.certifications);
    setSkillsInput(demo.skills.join(', '));
    patch(demo);
  }

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner" aria-hidden="true" />
        <p>Opening your resume…</p>
      </div>
    );
  }

  if (error && !resume) {
    return (
      <div className="empty-state" style={{ margin: 40 }}>
        <h2>Couldn't load this resume</h2>
        <p className="muted">{error}</p>
        <Link to="/dashboard" className="btn btn-primary">
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (!resume) return null;

  const liveScore = computeScore(resume);
  const saveLabel = { idle: 'Ready', saving: 'Saving…', saved: 'All changes saved', error: 'Could not save' }[saveState];

  return (
    <div className="editor-shell">
      <div className="editor-bar">
        <div className="editor-bar-left">
          <Link to="/dashboard" className="btn btn-ghost btn-sm">
            ← All resumes
          </Link>
          <input
            className="editor-title-input"
            value={resume.title}
            onChange={(e) => patch({ title: e.target.value })}
            aria-label="Resume title"
          />
        </div>
        <div className="editor-bar-right">
          <span className="save-status">{saveLabel}</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleLoadDemo}>
            Load demo
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={handlePrint}>
            Download PDF
          </button>
        </div>
      </div>

      <div className="editor-body">
        <div className="editor-form-pane">
          <div className="form-section-head" style={{ marginBottom: 20 }}>
            <ScoreMeter score={resume.score ?? liveScore} />
          </div>

          <section className="form-section">
            <div className="form-section-head">
              <h2>Personal details</h2>
            </div>
            <div className="form-grid-2">
              <label>
                Full name
                <input value={resume.personal?.name || ''} onChange={handlePersonalChange('name')} placeholder="Rahul Kumar" />
              </label>
              <label>
                Job title
                <input value={resume.personal?.role || ''} onChange={handlePersonalChange('role')} placeholder="Frontend Developer" />
              </label>
              <label>
                Email
                <input value={resume.personal?.email || ''} onChange={handlePersonalChange('email')} placeholder="rahul@email.com" />
              </label>
              <label>
                Phone
                <input value={resume.personal?.phone || ''} onChange={handlePersonalChange('phone')} placeholder="+91 98765 43210" />
              </label>
              <label>
                Location
                <input value={resume.personal?.location || ''} onChange={handlePersonalChange('location')} placeholder="Patna, Bihar" />
              </label>
              <label>
                LinkedIn
                <input value={resume.personal?.linkedin || ''} onChange={handlePersonalChange('linkedin')} placeholder="linkedin.com/in/rahulkumar" />
              </label>
              <label>
                GitHub
                <input value={resume.personal?.github || ''} onChange={handlePersonalChange('github')} placeholder="github.com/rahulkumar" />
              </label>
            </div>
            <label>
              Professional summary
              <textarea
                rows={4}
                value={resume.summary || ''}
                onChange={(e) => patch({ summary: e.target.value })}
                placeholder="Write 2–4 lines about your experience, strengths and goals..."
              />
            </label>
          </section>

          <RepeatSection
            title="Education"
            items={resume.education || []}
            onChange={(items) => patch({ education: items })}
            addLabel="Add"
            makeBlank={blankEducation}
            fields={[
              { key: 'degree', label: 'Degree', placeholder: 'B.Tech in Computer Science' },
              { key: 'school', label: 'College / University', placeholder: 'ABC University' },
              { key: 'year', label: 'Year', placeholder: '2022 – 2026' },
              { key: 'grade', label: 'Grade', placeholder: '8.5 CGPA' },
            ]}
          />

          <RepeatSection
            title="Experience"
            items={resume.experience || []}
            onChange={(items) => patch({ experience: items })}
            addLabel="Add"
            makeBlank={blankExperience}
            fields={[
              { key: 'title', label: 'Job title', placeholder: 'Software Intern' },
              { key: 'company', label: 'Company', placeholder: 'Company name' },
              { key: 'dates', label: 'Dates', placeholder: 'Jun 2025 – Aug 2025' },
              { key: 'location', label: 'Location', placeholder: 'Remote' },
              { key: 'description', label: 'What did you do?', placeholder: 'Built... Improved... Delivered...', type: 'textarea' },
            ]}
          />

          <RepeatSection
            title="Projects"
            items={resume.projects || []}
            onChange={(items) => patch({ projects: items })}
            addLabel="Add"
            makeBlank={blankProject}
            fields={[
              { key: 'name', label: 'Project name', placeholder: 'Study Planner' },
              { key: 'stack', label: 'Tech stack', placeholder: 'React, Node.js, MongoDB' },
              { key: 'description', label: 'Description', placeholder: 'Describe the problem, what you built and the result.', type: 'textarea' },
              { key: 'link', label: 'Link', placeholder: 'github.com/username/project' },
            ]}
          />

          <section className="form-section">
            <div className="form-section-head">
              <h2>Skills</h2>
            </div>
            <label>
              Skills <span className="hint">Separate with commas</span>
              <input value={skillsInput} onChange={handleSkillsChange} placeholder="JavaScript, React, Node.js, MongoDB, Git" />
            </label>
          </section>

          <RepeatSection
            title="Certifications"
            items={resume.certifications || []}
            onChange={(items) => patch({ certifications: items })}
            addLabel="Add"
            makeBlank={blankCertification}
            fields={[
              { key: 'name', label: 'Certificate', placeholder: 'AWS Cloud Practitioner' },
              { key: 'meta', label: 'Issuer / Year', placeholder: 'Amazon — 2026' },
              { key: 'link', label: 'Certificate link', placeholder: 'https://example.com/certificate' },
            ]}
          />
        </div>

        <div className="editor-preview-pane">
          <div className="template-picker-wrap">
            <div className="template-picker-heading">
              <div><strong>Choose a template</strong><span>20 polished designs</span></div>
              <span className="template-count">{TEMPLATES.findIndex((t) => t.id === (resume.template || 'classic')) + 1}/20</span>
            </div>
            <div className="template-picker">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={resume.template === t.id ? 'active' : ''}
                  onClick={() => patch({ template: t.id })}
                  title={t.note}
                >
                  <span className={`template-thumb ${t.id}`}><i /><i /><i /><i /></span>
                  <span className="template-option-copy"><b>{t.label}</b><small>{t.note}</small></span>
                </button>
              ))}
            </div>
          </div>
          <div className="paper-shell">
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>

      <div className="print-root" aria-hidden="true">
        <div className="print-paper-shell">
          <ResumePreview resume={resume} />
        </div>
      </div>
    </div>
  );
}
