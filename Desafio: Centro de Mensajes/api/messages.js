import { normalize, schema, denormalize } from "normalizr";
import { messages } from "../models/messages.js";

class Messages {
    constructor() {}

    async getMessages() {
        try {
            return this.normalizeMessages(await mensajes.find());
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

    normalizeMessages(messages) {
        const authorSchema = new schema.Entity(
            "author",
            {},
            { idAttribute: "authorEmail" }
        );

        const messageSchema = new schema.Entity(
            "post",
            {
                author: schemaAuthor,
            },
            { idAttribute: "_id" }
        );

        const messagesSchema = new schema.Entity(
            "posts",
            {
                messages: [messageSchema],
            },
            { idAttribute: "id" }
        );

        let messagesWithId = {
            id: "messages",
            messages: messages.map((message) => ({
                ...message._doc,
                _id: JSON.stringify(message._id),
            })),
        };

        let messagesWithIdNormalized = normalize(
            messagesWithId,
            messagesSchema
        );

        return messagesWithIdNormalized;
    }
}

export default Messages;
