import express from "express";
import http from "http";
import { Server } from "socket.io";

type MusicEvent =
  | { type: "play"; time: number; roomId: string }
  | { type: "pause"; roomId: string }
  | { type: "seek"; time: number; roomId: string };

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", socket => {
  console.log("Connected:", socket.id);

  socket.on("join-room", (roomId: string) => {
    socket.join(roomId);
  });

  socket.on("music", (event: MusicEvent) => {
    socket.to(event.roomId).emit("music", event);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
