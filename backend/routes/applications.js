const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getApplications,
  getApplicationsPublic,
  createApplication,
  updateApplication,
  deleteApplication
} = require('../controllers/applicationController');

router.route('/')
  .get(getApplicationsPublic)
  .post(createApplication);

router.route('/:id')
  .put(protect, updateApplication)
  .delete(protect, deleteApplication);

module.exports = router;