import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    email: { type: String, require: true, max: 100 },
    text: { type: String, require: true },
    date: { type: Date, require: true },
});

export const messages = mongoose.model("messages", MessageSchema);
