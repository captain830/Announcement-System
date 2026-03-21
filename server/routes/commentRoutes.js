const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { addComment, getComments } = require('../controllers/commentController');

// Routes
router.post('/:announcement_id', protect, addComment);
router.get('/:announcement_id', protect, getComments);

module.exports = router;