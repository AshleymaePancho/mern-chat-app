const asyncHandler = require('express-async-handler');
const MessageModel = require('../models/messageModel');
const UserModel = require('../models/userModel');
const ChatModel = require('../models/chatModel');

const getAllMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await MessageModel.find({ chat: req.params.chatId })
      .populate('sender', 'username picture email')
      .populate('chat');
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendMessages = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var messageHistory = await MessageModel.create(newMessage);

    messageHistory = await messageHistory.populate(
      'sender',
      'username picture'
    );
    messageHistory = await messageHistory.populate('chat');
    messageHistory = await UserModel.populate(messageHistory, {
      path: 'chat.users',
      select: 'username picture email',
    });

    await ChatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: messageHistory,
    });

    res.json(messageHistory);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { getAllMessages, sendMessages };
