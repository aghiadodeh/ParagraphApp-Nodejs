'use strict';
import fileUploader from '../middlewares/fileUploader';
import logger from '../middlewares/winston';

export default {
    /**
     * Save File sent in request to server
     * @param {Request} req request
     * @param {Response} res response
     * @param {String} folder the dir path you want to save the uploaded file in
     */
    uploadSingleFile: async (req, res, folder) => {
        const uploadOptions = fileUploader(folder);
        const uploadFile = uploadOptions.single("files");
        return new Promise(async (resolve, reject) => {
            try {
                uploadFile(req, res, async (err) => {
                    if (err) {
                        reject(err.message);
                    } else {
                        resolve(req.file);
                    }
                });
            } catch (err) {
                console.log(err);
                logger.error(err);
                reject(err);
            }
        });
    },

    /**
     * Save multi files sent in request to server
     * @param {Request} req request
     * @param {Response} res response
     * @param {String} folder the dir path you want to save the uploaded files in
     */
    uploadMultiFiles: async (req, res, folder) => {
        const uploadOptions = fileUploader(folder);
        const uploadFiles = uploadOptions.array("files", 10);
        return new Promise(async (resolve, reject) => {
            try {
                uploadFiles(req, res, async (err) => {
                    if (err) {
                        reject(err.message);
                    } else {
                        resolve(req.files);
                    }
                });
            } catch (err) {
                console.log(err);
                logger.error(err);
                reject(err);
            }
        });
    },
}
