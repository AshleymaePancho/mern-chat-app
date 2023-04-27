const express = require('express');
const {
  registerUser,
  authenticateUser,
  getAllUsers,
} = require('../controllers/userControllers');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').post(registerUser).get(protect, getAllUsers);
router.post('/login', authenticateUser);

module.exports = router;
