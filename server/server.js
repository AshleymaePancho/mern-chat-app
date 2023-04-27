const express = require('express');
const connectDataBase = require('./config/database');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { urlNotFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

dotenv.config();
connectDataBase();
app.use(express.json());

app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/message', messageRoutes);

app.use(urlNotFound, errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server is on frequency ${PORT}!`));

const socketIO = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
  },
});

socketIO.on('connection', (socket) => {
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
  });

  socket.on('new message', (newMessageRecieved) => {
    var chatroom = newMessageRecieved.chat;

    if (!chatroom.users) return;

    chatroom.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit('message recieved', newMessageRecieved);
    });
  });

  socket.off('setup', () => {
    socket.leave(userData._id);
  });
});
