function normalizeUrl(value) {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function Contact({ personal }) {
  const textItems = [personal.email, personal.phone, personal.location].filter(Boolean);
  const socialItems = [
    personal.linkedin ? { label: 'LinkedIn', value: personal.linkedin } : null,
    personal.github ? { label: 'GitHub', value: personal.github } : null,
  ].filter(Boolean);
  if (!textItems.length && !socialItems.length) return null;
  return (
    <div className="r-contact">
      {textItems.map((item, i) => <span key={`text-${i}`}>{item}</span>)}
      {socialItems.map((item) => (
        <a
          key={item.label}
          className="r-social-link"
          href={normalizeUrl(item.value)}
          target="_blank"
          rel="noopener noreferrer"
          title={`Open ${item.label}`}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}

function Sections({ resume }) {
  return (
    <>
      {resume.summary && <div className="r-section"><div className="r-section-title">Summary</div><p className="r-item-desc">{resume.summary}</p></div>}
      {resume.experience?.length > 0 && (
        <div className="r-section">
          <div className="r-section-title">Experience</div>
          {resume.experience.map((item) => (
            <div className="r-item" key={item.id}>
              <div className="r-item-row"><span>{item.title || 'Role'}{item.company ? ` · ${item.company}` : ''}</span><span>{item.dates}</span></div>
              {item.location && <div className="r-item-sub">{item.location}</div>}
              {item.description && <p className="r-item-desc">{item.description}</p>}
            </div>
          ))}
        </div>
      )}
      {resume.projects?.length > 0 && (
        <div className="r-section">
          <div className="r-section-title">Projects</div>
          {resume.projects.map((item) => (
            <div className="r-item" key={item.id}>
              <div className="r-item-row"><span>{item.name || 'Project'}</span><span>{item.link}</span></div>
              {item.stack && <div className="r-item-sub">{item.stack}</div>}
              {item.description && <p className="r-item-desc">{item.description}</p>}
            </div>
          ))}
        </div>
      )}
      {resume.education?.length > 0 && (
        <div className="r-section">
          <div className="r-section-title">Education</div>
          {resume.education.map((item) => (
            <div className="r-item" key={item.id}>
              <div className="r-item-row"><span>{item.degree || 'Degree'}</span><span>{item.year}</span></div>
              <div className="r-item-sub">{item.school}{item.grade ? ` · ${item.grade}` : ''}</div>
            </div>
          ))}
        </div>
      )}
      {resume.skills?.length > 0 && (
        <div className="r-section">
          <div className="r-section-title">Skills</div>
          <div className="r-skills">{resume.skills.map((s, i) => <span className="r-skill-chip" key={i}>{s}</span>)}</div>
        </div>
      )}
      {resume.certifications?.length > 0 && (
        <div className="r-section">
          <div className="r-section-title">Certifications</div>
          {resume.certifications.map((item) => (
            <div className="r-item" key={item.id}>
              <div className="r-item-row">
                <span>
                  {item.link ? (
                    <a
                      className="r-cert-link"
                      href={/^https?:\/\//i.test(item.link) ? item.link : `https://${item.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open certificate"
                    >
                      {item.name || 'Certificate'} ↗
                    </a>
                  ) : (
                    item.name || 'Certificate'
                  )}
                </span>
                <span>{item.meta}</span>
              </div>
              {item.link && (
                <div className="r-item-sub">
                  <a
                    className="r-cert-url"
                    href={/^https?:\/\//i.test(item.link) ? item.link : `https://${item.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View certificate
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function SidebarTemplate({ resume, variant }) {
  const personal = resume.personal || {};
  return (
    <article className={`resume-paper ${variant} r-layout-sidebar`}>
      <aside className="r-side">
        <div className="r-side-head">
          <div className="r-avatar">{(personal.name || 'Y').slice(0, 1).toUpperCase()}</div>
          <p className="r-name">{personal.name || 'Your Name'}</p>
          <p className="r-role">{personal.role || 'Your Role'}</p>
        </div>
        <Contact personal={personal} />
        {resume.skills?.length > 0 && <div className="r-side-section"><div className="r-section-title">Skills</div><div className="r-skills">{resume.skills.map((s, i) => <span className="r-skill-chip" key={i}>{s}</span>)}</div></div>}
      </aside>
      <div className="r-main"><Sections resume={{ ...resume, skills: [] }} /></div>
    </article>
  );
}

function HeaderTemplate({ resume, variant }) {
  const personal = resume.personal || {};
  return (
    <article className={`resume-paper ${variant}`}>
      <header className="r-header">
        <h1 className="r-name">{personal.name || 'Your Name'}</h1>
        <p className="r-role">{personal.role || 'Your Role'}</p>
        <Contact personal={personal} />
      </header>
      <Sections resume={resume} />
    </article>
  );
}

export default function ResumePreview({ resume }) {
  const template = resume.template || 'classic';
  const sidebar = new Set(['modern', 'creative', 'tech', 'startup', 'sidebar', 'luxe']);
  if (sidebar.has(template)) return <SidebarTemplate resume={resume} variant={template} />;
  return <HeaderTemplate resume={resume} variant={template} />;
}
