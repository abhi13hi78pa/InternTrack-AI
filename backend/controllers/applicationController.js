const Application = require('../models/Application');
const User = require('../models/User');

const getDemoUserId = async () => {
  const demoEmail = process.env.DEMO_USER_EMAIL || 'demo@interntrack.local';
  let user = await User.findOne({ email: demoEmail });
  if (!user) {
    user = await User.create({
      name: 'Demo User',
      email: demoEmail,
      password: process.env.DEMO_USER_PASSWORD || 'DemoPass123'
    });
  }
  return user._id;
};

// @desc    Get all applications for public demo
// @route   GET /api/applications
// @access  Public
const getApplicationsPublic = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications for logged in user
// @route   GET /api/applications/user
// @access  Private
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res) => {
  try {
    const { company, role, status, date, notes } = req.body;
    const userId = req.user ? req.user._id : await getDemoUserId();

    const application = await Application.create({
      user: userId,
      company,
      role,
      status,
      date,
      notes
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
const updateApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await application.deleteOne();
    res.json({ message: 'Application removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getApplications,
  getApplicationsPublic,
  createApplication,
  updateApplication,
  deleteApplication
};