import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import CookieParser from "cookie-parser";
import cookieParser from "cookie-parser";

const port = 4000;
const jwtSecret = "bsdbfbsdf";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(CookieParser());

app.use(
  cors({
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  })
);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/login", (req, res) => {
  const token = jwt.sign({ _id: "dfjjfdjndfjns" }, jwtSecret);

  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      message: "Login Success",
    });
});

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, (err) => {
    if (err) return next(err);
    const { token } = socket.request.cookies;
    if (!token) return next(new Error("Authentication Error"));
    const decoded = jwt.verify(token, jwtSecret);
    next();
  });
});

io.on("connection", (socket) => {
  console.log("userConnected");
  console.log("ID", socket.id);

  socket.on("message", ({ message, room }) => {
    console.log(message, room);
    socket.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User has joined room ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is Listening on port ${port}`);
});
