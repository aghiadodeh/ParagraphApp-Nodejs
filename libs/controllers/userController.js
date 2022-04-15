'use strict'
import express from "express";
import ResponseHelper from '../helpers/ResponseHelper';
import logger from '../middlewares/winston';
import UserService from "../services/UserService";
import Constants from "../config/constants";
import fs from 'fs';
import UploadService from "../services/UploadService";

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const body = req.body;
        // validate request
        if (!body.email) {
            return res.status(200).json(ResponseHelper.badResponse("email is required"));
        }
        if (!body.password) {
            return res.status(200).json(ResponseHelper.badResponse("password is required"));
        }

        // fetch user
        const selectFields = Constants.userSelect;
        delete selectFields.password;
        const user = await UserService.getUser({ email: body.email }, selectFields);
        if (!user) {
            return res.status(200).json(ResponseHelper.badResponse("user not found"));
        }
        // validate password
        const compare = await UserService.checkPassword(user.password, body.password);
        user.password = undefined;
        if (!compare) {
            return res.status(200).json(ResponseHelper.badResponse("password is invalid"));
        }
        // generate jwt token
        const token = UserService.generateToken(user);

        return res.status(200).json(ResponseHelper.successResponse({ user, token }));
    } catch (error) {
        console.log(error);
        logger.error(error);
        return res.status(200).json(ResponseHelper.badResponse(error.message));
    }
});

router.post('/register', async (req, res) => {
    try {
        const dir = `users`;
        if (!fs.existsSync(`./uploads/${dir}`)) fs.mkdirSync(`./uploads/${dir}`, { recursive: true });
        await UploadService.uploadSingleFile(req, res, dir);

        const body = req.body;
        // create user
        const user = await UserService.createUser(body, req.file);

        // generate jwt token
        const token = UserService.generateToken(user);

        return res.status(200).json(ResponseHelper.successResponse({ user, token }));
    } catch (error) {
        console.log(error);
        logger.error(error);
        return res.status(200).json(ResponseHelper.badResponse(error.message));
    }
});

export default router;