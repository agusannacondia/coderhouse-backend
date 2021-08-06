import mongoose from "mongoose";
import normalizr from "normalizr";
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
const schema = normalizr.schema;

const schemaAuthor = new schema.Entity("author", { idAttribute: "email" });

const MessageSchema = new mongoose.Schema({
    author: {
        authorEmail:{type: String, required: true},
        authorName:{type: String},
        authorSurname:{type: String},
        authorAge:{type: String},
        fyh:{type: Date, required:true}
    },
    text: {type: String, required: true}
});

export const messages = mongoose.model("messages", MessageSchema);
