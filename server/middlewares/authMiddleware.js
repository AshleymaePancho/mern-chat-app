const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      var token = req.headers.authorization.split(' ')[1];

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await UserModel.findById(decodedToken.id).select('-password');

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed.');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token.');
  }
});

module.exports = { protect };
