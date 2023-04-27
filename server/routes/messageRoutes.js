const express = require('express');
const {
  getAllMessages,
  sendMessages,
} = require('../controllers/messageControllers');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').post(protect, sendMessages);
router.route('/:chatId').get(protect, getAllMessages);

module.exports = router;
