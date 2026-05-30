const mongoose = require('mongoose');

const roadmapTaskSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['DSA', 'System Design', 'Core Subjects', 'Behavioral', 'Mock Interview', 'Resume', 'General'],
    default: 'General'
  },
  completed: {
    type: Boolean,
    default: false,
  }
});

const studyMaterialSchema = new mongoose.Schema({
  title: String,
  type: {
    type: String,
    enum: ['Video', 'Article', 'Platform', 'Documentation', 'Repository', 'Other'],
    default: 'Other'
  },
  url: String,
  description: String,
  category: String
});

const roadmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  timeRemaining: {
    type: String,
    required: true,
  },
  companyInsights: {
    overview: String,
    hiringProcess: String,
    interviewRounds: [String],
    commonQuestions: [String],
    resumeTips: [String]
  },
  skillGapAnalysis: {
    missingSkills: [String],
    recommendations: [String]
  },
  tasks: [roadmapTaskSchema],
  studyMaterials: [studyMaterialSchema],
  overallReadiness: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Roadmap', roadmapSchema);
