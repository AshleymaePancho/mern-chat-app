const express = require('express');
const {
  accessChat,
  getAllChats,
  createGroupChat,
  renameGroupChat,
  addToGroupChat,
  removeFromGroupChat,
} = require('../controllers/chatControllers');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').post(protect, accessChat);
router.route('/').get(protect, getAllChats);
router.route('/group').post(protect, createGroupChat);
router.route('/group-edit').put(protect, renameGroupChat);
router.route('/group-add').put(protect, addToGroupChat);
router.route('/group-remove').put(protect, removeFromGroupChat);

module.exports = router;
