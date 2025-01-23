import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: String,
            required: true
        }, // Clerk user ID
        receiverId: {
            type: String,
            required: true,
        }, // Clerk user ID
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true } // createdAt, updatedAt
);


export const Song = mongoose.model("Message", messageSchema);