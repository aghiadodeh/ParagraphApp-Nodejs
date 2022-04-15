'use strict'
import FileHelper from "../helpers/FileHelper";
import Attachment from "../models/Attachment";
const mime = require('mime-types');

export default {
    /**
     * mapping uploaded request files (by multer) to Attachment model
     * @param {[Object]} files 
     * @returns List of Attachments
     */
     mappingAttachments: (files) => {
        if (!files) return [];
        const attachments = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const mimetype = mime.lookup(file.originalname);
            const path = `${file.destination}/${file.filename}`;
            attachments.push({
                filePath: path,
                fileName: file.filename,
                fileSize: FileHelper.getFileSizeInMegabytes(path),
                fileSizeInBytes: FileHelper.getFileSizeInBytes(path),
                mimetype: mimetype,
                originalName: file.originalname,
            });
        }

        return attachments;
    },
}