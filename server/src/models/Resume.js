import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: 'Untitled Resume', trim: true },
    template: { type: String, default: 'classic', enum: ['classic', 'modern', 'minimal', 'executive', 'elegant', 'creative', 'tech', 'ats', 'academic', 'compact', 'bold', 'corporate', 'swiss', 'editorial', 'startup', 'timeline', 'sidebar', 'monochrome', 'fresh', 'luxe'] },
    score: { type: Number, default: 0 },
    personal: { type: Object, default: {} },
    summary: { type: String, default: '' },
    education: { type: Array, default: [] },
    experience: { type: Array, default: [] },
    projects: { type: Array, default: [] },
    skills: { type: Array, default: [] },
    certifications: { type: Array, default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('Resume', resumeSchema);
