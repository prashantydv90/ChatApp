
  import express from "express";
  import mongoose from "mongoose";
  import cors from "cors";
  import dotenv from "dotenv";
  import cookieParser from "cookie-parser";
  import http from "http";
  import { Server } from "socket.io";
  import messageRouter from "./app/routes/message.routes.js";
  import userRouter from "./app/routes/user.routes.js";

  dotenv.config();
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.URL || "http://localhost:5173",
      credentials: true,
    },
  });

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: process.env.URL || "http://localhost:5173", credentials: true }));

  const mongoUrl = process.env.DBURL || "mongodb://localhost:27017/chatapp";
  mongoose.connect(mongoUrl)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Connection Error:", err));

  app.use("/api/messages", messageRouter);
  app.use("/api", userRouter);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("send-message", ({ to, messageData }) => {
      io.to(to).emit("receive-message", messageData);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  server.listen(process.env.PORT || 1112, () => console.log("Server running"));