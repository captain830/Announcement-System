const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { updateProfile, getUserStats } = require('../controllers/userController');

router.put('/profile', protect, updateProfile);
router.get('/stats', protect, getUserStats);

module.exports = router;