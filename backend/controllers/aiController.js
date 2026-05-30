const Roadmap = require('../models/Roadmap');
const aiService = require('../services/aiService');

// @desc    Generate a new AI preparation roadmap
// @route   POST /api/ai/generate
// @access  Private
const generateRoadmap = async (req, res) => {
  try {
    const { company, role, timeRemaining, skills } = req.body;

    if (!company || !role || !timeRemaining) {
      return res.status(400).json({ message: 'Company, role, and time remaining are required.' });
    }

    // Call Gemini API
    const aiData = await aiService.generatePrepRoadmap(company, role, timeRemaining, skills);

    if (!aiData || !Array.isArray(aiData.tasks) || aiData.tasks.length === 0) {
      throw new Error('AI returned an incomplete roadmap. Please try again.');
    }

    // Create DB record
    const newRoadmap = await Roadmap.create({
      user: req.user._id,
      company,
      role,
      timeRemaining,
      companyInsights: aiData.companyInsights,
      skillGapAnalysis: aiData.skillGapAnalysis,
      tasks: aiData.tasks,
      studyMaterials: aiData.studyMaterials,
      overallReadiness: 0
    });

    res.status(201).json(newRoadmap);
  } catch (error) {
    console.error('Error generating roadmap:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get user's roadmaps
// @route   GET /api/ai/roadmaps
// @access  Private
const getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user._id }).sort('-createdAt');
    res.json(roadmaps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update task completion status
// @route   PUT /api/ai/roadmaps/:id/tasks/:taskId
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const { completed } = req.body;

    const roadmap = await Roadmap.findOne({ _id: id, user: req.user._id });

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    const task = roadmap.tasks.find(t => t.id === taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = completed;

    // Recalculate readiness
    const completedTasks = roadmap.tasks.filter(t => t.completed).length;
    roadmap.overallReadiness = Math.round((completedTasks / roadmap.tasks.length) * 100);

    await roadmap.save();

    res.json(roadmap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a roadmap
// @route   DELETE /api/ai/roadmaps/:id
// @access  Private
const deleteRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ _id: req.params.id, user: req.user._id });

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    await roadmap.deleteOne();
    res.json({ message: 'Roadmap removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  generateRoadmap,
  getRoadmaps,
  updateTaskStatus,
  deleteRoadmap
};
