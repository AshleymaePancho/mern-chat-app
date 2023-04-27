const asyncHandler = require('express-async-handler');
const ChatModel = require('../models/chatModel');
const UserModel = require('../models/userModel');

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.sendStatus(400);
  }

  var chatMessages = await ChatModel.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');

  chatMessages = await UserModel.populate(chatMessages, {
    path: 'latestMessage.sender',
    select: 'username picture email',
  });

  if (chatMessages.length > 0) {
    res.send(chatMessages[0]);
  } else {
    var chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await ChatModel.create(chatData);
      const fullChat = await ChatModel.findOne({
        _id: createdChat._id,
      }).populate('users', '-password');
      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const getAllChats = asyncHandler(async (req, res) => {
  try {
    ChatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await UserModel.populate(results, {
          path: 'latestMessage.sender',
          select: 'username picture email',
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: 'Please fill all the feilds.' });
  }

  var groupChatMembers = JSON.parse(req.body.users);

  if (groupChatMembers.length < 2) {
    return res
      .status(400)
      .send('More than 2 users are required to form a group chat.');
  }

  groupChatMembers.push(req.user);

  try {
    const groupChat = await ChatModel.create({
      chatName: req.body.name,
      users: groupChatMembers,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await ChatModel.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!updatedChat) {
    res.status(404);
    throw new Error('Chat not found');
  } else {
    res.json(updatedChat);
  }
});

const addToGroupChat = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const userAdded = await ChatModel.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!userAdded) {
    res.status(404);
    throw new Error('Chat not found.');
  } else {
    res.json(userAdded);
  }
});

const removeFromGroupChat = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removedUser = await ChatModel.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!removedUser) {
    res.status(404);
    throw new Error('Chat not found.');
  } else {
    res.json(removedUser);
  }
});

module.exports = {
  accessChat,
  getAllChats,
  createGroupChat,
  renameGroupChat,
  addToGroupChat,
  removeFromGroupChat,
};
