const express = require("express");
const socket = require("socket.io");

// App setup
const PORT = 5000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);

});

// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server);

//we use a set to store users, sets objects are for unique values of any type
const activeUsers = new Set();

io.on("connection", function (socket) {
  console.log("Made socket connection");

  socket.on("new user", function (data) {
    socket.userId = data;
    activeUsers.add(data);
    //... is the the spread operator, adds to the set while retaining what was in there already
    io.emit("new user", [...activeUsers]);
  });

  //run when client disconnects
  socket.on("disconnect", function () {
      activeUsers.delete(socket.userId);
      io.emit("user disconnected", socket.userId);
    });

    //display the typed message
    socket.on("chat message", function (data) {
      io.emit("chat message", data);
  });

  //show that someone is typing
    socket.on("user typing", function(){
      io.emit("user is typing");
  })

//when a user disconnects
    socket.on("user disconnected", function(){
      io.emit("Client user has disconnected");
  })

  socket.on("new user", function() {
    io.emit("New user has joined the chat");
  })

})