'use strict'
import mongoose from "mongoose";

const Attachment = mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        default: null
    },
    fileSizeInBytes: {
        type: Number,
        default: null
    },
    mimetype: {
        type: String,
        default: null
    },
    filePath: {
        type: String,
        required: true
    },
}, { timestamps: true, versionKey: false });

// export default mongoose.model("Attachments", Attachment);

export default Attachment;