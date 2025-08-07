import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import {
  uploadToCloudinary,
  isCloudinaryConfigured,
} from "../utils/cloudinary.js";

export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message, messageType = "text" } = req.body;

    const messageData = {
      senderId,
      receiverId,
      message,
      messageType,
    };

    const newMessage = await Message.create(messageData);

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    res.status(200).json({ success: true, message: newMessage });
  } catch (err) {
    res.status(500).json({ success: false, message: "Send failed" });
  }
};

export const sendFileMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message = "" } = req.body;
    const file = req.file;

    console.log("File upload request received:", {
      senderId,
      receiverId,
      fileName: file?.originalname,
    });

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      console.error(
        "Cloudinary not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env file"
      );
      return res.status(500).json({
        success: false,
        message:
          "File upload service not configured. Please contact administrator.",
      });
    }

    // Determine message type based on file mimetype
    let messageType = "document";
    let resourceType = "auto";

    if (file.mimetype.startsWith("image/")) {
      messageType = "image";
      resourceType = "image";
    } else if (file.mimetype.startsWith("video/")) {
      messageType = "video";
      resourceType = "video";
    } else if (
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("application/")
    ) {
      messageType = "document";
      resourceType = "raw"; // VERY IMPORTANT
    }

    console.log("Uploading file to Cloudinary:", {
      messageType,
      resourceType,
      size: file.size,
    });

    // Upload file to Cloudinary
    const uploadResult = await uploadToCloudinary(
      file.buffer,
      file.originalname,
      resourceType
    );

    const messageData = {
      senderId,
      receiverId,
      message: message || `Sent a ${messageType}`,
      messageType,
      fileUrl: uploadResult.secure_url,
      fileName: file.originalname,
      fileSize: file.size,
    };

    const newMessage = await Message.create(messageData);

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    console.log("File upload successful:", {
      messageId: newMessage._id,
      fileUrl: newMessage.fileUrl,
    });
    res.status(200).json({ success: true, message: newMessage });
  } catch (err) {
    console.error("File upload error:", err);
    console.error("Error stack:", err.stack);
    res
      .status(500)
      .json({ success: false, message: "File upload failed: " + err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    res
      .status(200)
      .json({ success: true, messages: conversation?.messages || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
};
