const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var userModel = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    picture: {
      type: String,
      default: 'https://i.stack.imgur.com/34AD2.jpg',
    },
  },
  { timestamps: true }
);

userModel.methods.matchPassword = async function (givenPassword) {
  return await bcrypt.compare(givenPassword, this.password);
};

userModel.pre('save', async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userModel);
