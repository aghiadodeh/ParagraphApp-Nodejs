'use strict'
import express from "express";
import ResponseHelper from '../helpers/ResponseHelper';
import verifyToken from '../middlewares/jwtMiddleware';
import logger from '../middlewares/winston';
import ParagraphService from "../services/ParagraphService";
import Constants from "../config/constants";
import ObjectHelper from "../helpers/ObjectHelper";
import fs from 'fs';
import UploadService from "../services/UploadService";
import mongoose from "mongoose";

const router = express.Router();

router.post('/create', verifyToken([Constants.roles.user]), async (req, res) => {
    try {
        // upload files
        const dir = `paragraphs/${req.id}`;
        if (!fs.existsSync(`./uploads/${dir}`)) fs.mkdirSync(`./uploads/${dir}`, { recursive: true });
        await UploadService.uploadMultiFiles(req, res, dir);

        const body = req.body;
        const files = req.files;
        // save paragraph
        const paragraph = await ParagraphService.createParagraph(req.id, body, files);
        paragraph.user = req.user;

        return res.status(200).json(ResponseHelper.successResponse(paragraph));
    } catch (error) {
        console.log(error);
        logger.error(error);
        return res.status(200).json(ResponseHelper.badResponse(error.message));
    }
});

router.post('/list', verifyToken(Object.values(Constants.roles)), async (req, res) => {
    try {
        await ResponseHelper.sleep(1500);
        const { per_page, skip } = ObjectHelper.paginationData(req.body);
        const { paragraphs, count } = await ParagraphService.getParagraphs({}, skip, per_page);
        return res.status(200).json(ResponseHelper.successResponse({ paragraphs, count }));
    } catch (error) {
        console.log(error);
        logger.error(error);
        return res.status(200).json(ResponseHelper.badResponse(error.message));
    }
});

router.get('/get-paragraph', verifyToken(Object.values(Constants.roles)), async (req, res) => {
    try {
        const condition = { _id: mongoose.Types.ObjectId(req.query.id) };
        const { paragraphs, _ } = await ParagraphService.getParagraphs(condition, 0, 1);
        const paragraph = (paragraphs && paragraphs.length > 0) ? paragraphs[0] : null;
        if (paragraph) {
            ParagraphService.updateParagraphSeenBy(req.id, paragraph._id);
        }
        return res.status(200).json(ResponseHelper.successResponse(paragraph));
    } catch (error) {
        console.log(error);
        logger.error(error);
        return res.status(200).json(ResponseHelper.badResponse(error.message));
    }
});

router.post('/add-comment', verifyToken([Constants.roles.user]), async (req, res) => {
    try {
        // upload files
        const dir = `comments/${req.id}`;
        if (!fs.existsSync(`./uploads/${dir}`)) fs.mkdirSync(`./uploads/${dir}`, { recursive: true });
        await UploadService.uploadMultiFiles(req, res, dir);

        const body = req.body;
        const files = req.files;
        // save comment
        const comment = await ParagraphService.addComment(req.id, body, files);
        comment.user = req.user;
        return res.status(200).json(ResponseHelper.successResponse(comment));
    } catch (error) {
        console.log(error);
        logger.error(error);
        return res.status(200).json(ResponseHelper.badResponse(error.message));
    }
});

router.post('/delete-comment', verifyToken([Constants.roles.user]), async (req, res) => {
    try {
        await ParagraphService.deleteComment(req.body);
        return res.status(200).json(ResponseHelper.successResponse(null));
    } catch (error) {
        console.log(error);
        logger.error(error);
        return res.status(200).json(ResponseHelper.badResponse(error.message));
    }
});

router.post('/comments-list', verifyToken(Object.values(Constants.roles)), async (req, res) => {
    try {
        const { per_page, skip } = ObjectHelper.paginationData(req.body);
        const comments = await ParagraphService.getParagraphComments(req.body.paragraph, skip, per_page);
        return res.status(200).json(ResponseHelper.successResponse(comments));
    } catch (error) {
        console.log(error);
        logger.error(error);
        return res.status(200).json(ResponseHelper.badResponse(error.message));
    }
});

export default router;