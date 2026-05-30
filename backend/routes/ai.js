const express = require('express');
const router = express.Router();
const {
  generateRoadmap,
  getRoadmaps,
  updateTaskStatus,
  deleteRoadmap
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.route('/generate').post(protect, generateRoadmap);
router.route('/roadmaps').get(protect, getRoadmaps);
router.route('/roadmaps/:id').delete(protect, deleteRoadmap);
router.route('/roadmaps/:id/tasks/:taskId').put(protect, updateTaskStatus);

module.exports = router;
