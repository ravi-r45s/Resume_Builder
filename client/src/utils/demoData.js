import { uid } from './resumeDefaults.js';

export function demoResume() {
  return {
    title: 'Software Developer Resume',
    template: 'classic',
    personal: {
      name: 'Rahul Kumar',
      role: 'Frontend Developer',
      email: 'rahul.kumar@email.com',
      phone: '+91 98765 43210',
      location: 'Patna, Bihar',
      linkedin: 'linkedin.com/in/rahulkumar',
      github: 'github.com/rahulkumar',
    },
    summary:
      'Frontend developer with 2 years of experience building responsive web apps in React. Comfortable working across the stack and shipping features end to end.',
    education: [
      { id: uid(), degree: 'B.Tech in Computer Science', school: 'ABC University', year: '2022 – 2026', grade: '8.5 CGPA' },
    ],
    experience: [
      {
        id: uid(),
        title: 'Software Intern',
        company: 'Tech Solutions Pvt Ltd',
        dates: 'Jun 2025 – Aug 2025',
        location: 'Remote',
        description:
          'Built and shipped 4 customer-facing React components used across the product.\nImproved page load time by 30% by optimising bundle size.\nFixed 25+ bugs reported through the internal tracker.',
      },
    ],
    projects: [
      {
        id: uid(),
        name: 'Study Planner',
        stack: 'React, Node.js, MongoDB',
        description: 'A planner that helps students schedule revision. Used by 200+ students in the first month.',
        link: 'github.com/rahulkumar/study-planner',
      },
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'Tailwind CSS'],
    certifications: [{ id: uid(), name: 'AWS Cloud Practitioner', meta: 'Amazon — 2026' }],
  };
}
