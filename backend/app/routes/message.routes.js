import express from "express";
import { getMessages, sendMessage, sendFileMessage } from "../controller/message.controller.js";
import upload from "../middleware/multer.config.js";

const messageRouter = express.Router();

messageRouter.post("/send", sendMessage);
messageRouter.post("/send-file", upload.single('file'), sendFileMessage);
messageRouter.get("/get/:senderId/:receiverId", getMessages);

export default messageRouter;