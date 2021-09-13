const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
  },
});

io.use((socket, next) => {
  const isAdmin = socket.handshake.auth.admin;

  socket.isAdmin = isAdmin;

  if (isAdmin) {
    return next();
  }

  const username = socket.handshake.auth.username;

  if (!username) {
    return next(new Error('invalid username'));
  }
  socket.username = username;
  next();
});

io.on('connection', socket => {
  // fetch existing users
  const users = [];

  // console.log(socket.isAdmin);

  for (let [id, socket] of io.of('/').sockets) {
    if (socket.username) {
      users.push({
        userID: id,
        username: socket.username,
        chatArr: [],
      });
    }
  }

  socket.emit('users', users);
  // notify existing users
  if (!socket.isAdmin) {
    socket.broadcast.emit('user connected', {
      userID: socket.id,
      username: socket.username,
    });
  }

  socket.on('chatRequest', ({ username }) => {
    // console.log(`Chat Request: ${username}`);
    // socket.broadcast.emit('request', username);
    socket.broadcast.emit('request', username);
  });

  socket.on('acceptUser', ({ userID, adminName }) => {
    socket.to(userID).emit('adminResponse', adminName);
  });

  socket.on('chat', ({ message }) => {
    const curUser = users.find(user => user.userID === socket.id);
    curUser.chatArr.push({ message, isUser: true });
    console.log(curUser);
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
  socket.on('disconnect', () => {
    socket.broadcast.emit('user disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => console.log(`server listening at http://localhost:${PORT}`));
