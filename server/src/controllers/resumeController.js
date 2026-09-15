import Resume from '../models/Resume.js';
import asyncHandler from '../utils/asyncHandler.js';

const ALLOWED_FIELDS = [
  'title',
  'template',
  'personal',
  'summary',
  'education',
  'experience',
  'projects',
  'skills',
  'certifications',
];

function pickAllowed(body) {
  const data = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  return data;
}

function computeScore(resume) {
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

export const listResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json(resumes);
});

export const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) return res.status(404).json({ message: 'Resume not found' });
  res.json(resume);
});

export const createResume = asyncHandler(async (req, res) => {
  const data = pickAllowed(req.body);
  data.score = computeScore(data);
  const resume = await Resume.create({ ...data, user: req.user._id });
  res.status(201).json(resume);
});

export const updateResume = asyncHandler(async (req, res) => {
  const data = pickAllowed(req.body);
  const existing = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!existing) return res.status(404).json({ message: 'Resume not found' });

  Object.assign(existing, data);
  existing.score = computeScore(existing);
  await existing.save();

  res.json(existing);
});

export const deleteResume = asyncHandler(async (req, res) => {
  const result = await Resume.deleteOne({ _id: req.params.id, user: req.user._id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Resume not found' });
  res.status(204).end();
});

export const duplicateResume = asyncHandler(async (req, res) => {
  const original = await Resume.findOne({ _id: req.params.id, user: req.user._id }).lean();
  if (!original) return res.status(404).json({ message: 'Resume not found' });

  delete original._id;
  delete original.createdAt;
  delete original.updatedAt;
  original.title = `${original.title} (Copy)`;

  const copy = await Resume.create(original);
  res.status(201).json(copy);
});
