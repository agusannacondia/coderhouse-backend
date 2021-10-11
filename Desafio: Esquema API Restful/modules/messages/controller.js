import { messages } from "./model.js";

class Messages {
    constructor() {}

    async getMessages() {
        try {
            return await messages.find();
        } catch (err) {
            throw err;
        }
    }

    async addMessage(message) {
        try {
            return messages.create(message);
        } catch (err) {
            throw err;
        }
    }
}

export default Messages;
