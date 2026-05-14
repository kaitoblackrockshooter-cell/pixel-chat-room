const express = require("express");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {

    console.log("user connected");

    players[socket.id] = {
        x: 400,
        y: 300
    };

    io.emit("players", players);

    socket.on("move", (data) => {

        players[socket.id] = data;

        io.emit("players", players);
    });

    socket.on("chat", (message) => {

        io.emit("chat", {
            id: socket.id,
            message: message
        });
    });

    socket.on("disconnect", () => {

        delete players[socket.id];

        io.emit("players", players);
    });
});

http.listen(3000, () => {
    console.log("server running");
});