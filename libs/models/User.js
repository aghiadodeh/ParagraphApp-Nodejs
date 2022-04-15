import mongoose from "mongoose";
import Constants from "../config/constants";
import Attachment from "./Attachment";

const User = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    image: Attachment
}, { timestamps: true, versionKey: false });

export default mongoose.model("users", User);