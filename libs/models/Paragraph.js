'use strict'
import mongoose from "mongoose";
import Attachment from "./Attachment";

const Paragraph = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: [{
        type: String
    }],
    attachments: [Attachment],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        comment: {
            type: String,
            default: null,
        },
        attachments: [Attachment],
        createdAt: {
            type: Date,
            default: Date.now(),
        },
    }],
    seenBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        seenAt: {
            type: Date,
            default: Date.now(),
        },
    }],
    rates: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        rate: {
            type: Number,
            required: true
        }
    }]
}, { timestamps: true, versionKey: false });

export default mongoose.model("paragraphs", Paragraph);