import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Landing() {
  const { user } = useAuth();
  const startHref = user ? '/dashboard' : '/register';

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow-plain">Free resume builder</p>
          <h1>Write a resume that survives the first fifteen seconds.</h1>
          <p className="hero-lede">
            Fill in your details once, watch it typeset into a clean, printable resume as you go, and see exactly
            where it's thin before a recruiter does.
          </p>
          <div className="hero-actions">
            <Link to={startHref} className="btn btn-primary">
              {user ? 'Go to my resumes' : 'Build your resume'}
            </Link>
            <Link to={user ? '/dashboard' : '/login'} className="btn btn-ghost">
              {user ? 'View dashboard' : 'Log in'}
            </Link>
          </div>
          <p className="hero-note">No credit card needed. Export to PDF anytime.</p>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="stack-sheet back" />
          <div className="stack-sheet mid" />
          <div className="stack-sheet front">
            <div className="clip" />
            <p className="sheet-name">Rahul Kumar</p>
            <p className="sheet-role">Frontend Developer</p>
            <div className="sheet-rule" />
            <div className="sheet-line w80" />
            <div className="sheet-line w60" />
            <div className="sheet-line w40" />
            <div className="sheet-rule" />
            <div className="sheet-line w60" />
            <div className="sheet-line w80" />
            <div className="sheet-line w40" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Everything a resume needs, nothing it doesn't</h2>
        </div>
        <div className="feature-grid">
          <div className="feature">
            <h3>Live preview</h3>
            <p>Every field you fill updates the actual resume layout immediately, so you're never guessing how it reads.</p>
          </div>
          <div className="feature">
            <h3>Three layouts</h3>
            <p>Switch between a classic single column, a modern sidebar layout and a stripped-back minimal style, anytime.</p>
          </div>
          <div className="feature">
            <h3>Resume score</h3>
            <p>A running score flags thin sections — missing summary, no measurable results, too few skills — as you type.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>How it works</h2>
        </div>
        <div className="steps">
          <div className="step">
            <p className="step-num">01</p>
            <h3>Add your details</h3>
            <p>Personal info, education, experience, projects, skills and certifications — organised into clear sections.</p>
          </div>
          <div className="step">
            <p className="step-num">02</p>
            <h3>Pick a layout</h3>
            <p>Your content stays the same; the template just changes how it's typeset on the page.</p>
          </div>
          <div className="step">
            <p className="step-num">03</p>
            <h3>Export the PDF</h3>
            <p>Download a print-ready PDF straight from the browser — no watermark, no extra step.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="cta-band">
          <div>
            <h2>Your resume is worth ten minutes.</h2>
            <p>Start with a blank page or load a filled-in example to see how it looks.</p>
          </div>
          <Link to={startHref} className="btn btn-primary">
            {user ? 'Go to my resumes' : 'Get started free'}
          </Link>
        </div>
      </section>

      <footer className="footer">
        <span>ResumeForge</span>
        <span>Built with the MERN stack</span>
      </footer>
    </>
  );
}
