import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: function() {
            return !this.fileUrl; // Message is required only if no file is attached
        }
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'video', 'document'],
        default: 'text'
    },
    fileUrl: {
        type: String,
        required: function() {
            return this.messageType !== 'text';
        }
    },
    fileName: {
        type: String,
        required: function() {
            return this.messageType === 'document';
        }
    },
    fileSize: {
        type: Number
    }
},{timestamps:true});
export const Message = mongoose.model('Message', messageSchema);