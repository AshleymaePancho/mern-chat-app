const asyncHandler = require('express-async-handler');
const generateToken = require('../config/generateToken');
const UserModel = require('../models/userModel');

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, picture } = req.body;

  if (!username || !email || !password) {
    resizeBy.status(400);
    throw new Error('Please eneter all fields.');
  }

  const userExists = await UserModel.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists!');
  }

  const user = await UserModel.create({
    username,
    email,
    password,
    picture,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      picture: user.picture,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Failed to create user.');
  }
});

const authenticateUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      picture: user.picture,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    res.send(`Invalid password or email.`);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  const users = await UserModel.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  res.send(users);
});

module.exports = { registerUser, authenticateUser, getAllUsers };
