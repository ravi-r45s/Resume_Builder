let counter = 0;
export function uid() {
  counter += 1;
  return `id_${Date.now()}_${counter}`;
}

export function blankResume() {
  return {
    title: 'Untitled Resume',
    template: 'classic',
    personal: { name: '', role: '', email: '', phone: '', location: '', linkedin: '', github: '' },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
  };
}

export function blankEducation() {
  return { id: uid(), degree: '', school: '', year: '', grade: '' };
}

export function blankExperience() {
  return { id: uid(), title: '', company: '', dates: '', location: '', description: '' };
}

export function blankProject() {
  return { id: uid(), name: '', stack: '', description: '', link: '' };
}

export function blankCertification() {
  return { id: uid(), name: '', meta: '', link: '' };
}

export function computeScore(resume) {
  let score = 0;
  const p = resume.personal || {};
  if (p.name) score += 10;
  if (p.email) score += 5;
  if (p.phone) score += 5;
  if (resume.summary && resume.summary.trim().length > 40) score += 15;
  if ((resume.education || []).length) score += 15;
  if ((resume.experience || []).length) score += 20;
  if ((resume.projects || []).length) score += 15;
  if ((resume.skills || []).length >= 3) score += 10;
  if ((resume.certifications || []).length) score += 5;
  return Math.min(100, score);
}
