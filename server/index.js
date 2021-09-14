const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
  },
});

// io.use((socket, next) => {
//   socket.isAdmin = socket.handshake.auth.admin;

//   if (isAdmin) {
//     return next();
//   }

//   const username = socket.handshake.auth.username;

//   if (!username) {
//     return next(new Error('invalid username'));
//   }
//   socket.username = username;
//   next();
// });

// State
let users = [];

io.on('connection', socket => {
  // fetch existing users
  socket.emit('getAllUsers', users);
  socket.on('login', ({ username }) => {
    const user = {
      userID: socket.id,
      username,
      isRequest: false,
      isAccepted: false,
      connected: true,
      message: '',
      chatArr: [],
    };
    users.push(user);
    socket.broadcast.emit('user', user);
  });

  socket.on('chatRequest', ({ username }) => {
    const userObj = users.find(user => user.username === username);
    socket.broadcast.emit('request', userObj);
  });

  socket.on('acceptUser', ({ userID, adminName, message }) => {
    socket.to(userID).emit('adminResponse', { adminName, message });
  });

  socket.on('chat', ({ message }) => {
    const curUser = users.find(user => user.userID === socket.id);
    curUser.chatArr.push({ message, isUser: true });
    socket.broadcast.emit('getChatUser', { message, isUser: true });
  });

  // socket.on('connectChat', idClient => {});
  // // forward the private message to the right recipient
  // socket.on('private message', ({ content, to }) => {
  //   socket.to(to).emit('private message', {
  //     content,
  //     from: socket.id,
  //   });
  // });

  // notify users upon disconnection
  socket.on('typing', ({ userID }) => {
    socket.to(userID).emit('adminTyping');
  });

  socket.on('disconnect', () => {
    users = users.filter(user => user.userID !== socket.id);
    socket.broadcast.emit('user disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => console.log(`server listening at http://localhost:${PORT}`));
