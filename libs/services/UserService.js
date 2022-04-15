'use strict';

import User from "../models/User";
import bcrypt from "bcrypt";
import ObjectHelper from "../helpers/ObjectHelper";
import jsonwebtoken from "jsonwebtoken";
import Constants from "../config/constants";
import AttachmentService from "./AttachmentService";

export default {
    /**
     * find user in database
     * @param {Object} condition object contains fields you want to search by
     * @param {Object} select fields you want to get from user object
     * @returns {User} User
     */
    getUser: async (condition, select = {}) => {
        return await User.findOne(condition).select(select);
    },

    /**
     * insert new user to database
     * @param {User} user req.body
     * @param {Object} image uploaded image
     * @returns user after saving
     */
    createUser: async (user, file) => {
        const attachments = AttachmentService.mappingAttachments([file]);
        // validate user object
        if (!user.username) {
            throw new Error("username is required.");
        }
        if (!ObjectHelper.isEmailVaild(user.email)) {
            throw new Error("email is invalid.");
        }
        if (!user.password) {
            throw new Error("password is required.");
        }
        if (attachments.length == 0) {
            throw new Error("image is required.");
        }

        // check if email exists
        const exists = await User.findOne({ email: user.email });
        if (exists) {
            throw new Error("email is exists, try another one.");
        }

        const hashed = await bcrypt.hash(user.password, 15);
        user.username = ObjectHelper.firstUpper(user.username);
        user.password = hashed;
        user.email = user.email.toLowerCase();
        user.image = attachments.length > 0 ? attachments[0] : null;

        user = await User.create(user);
        // remove unwanted keys from object
        Object.keys(Constants.userSelect).forEach(key => { user[key] = undefined; });

        return user;
    },

    /**
     * combine password with hashed password
     * @param {String} hashedPassword 
     * @param {String} password 
     * @returns {Boolean} hashedPassword is match password
     */
    checkPassword: async (hashedPassword, password) => {
        return await bcrypt.compare(password, hashedPassword);
    },

    /**
     * generate jwt token
     * @param {User} user 
     * @returns jwt token
     */
    generateToken: (user) => {
        const payload = { id: user._id, role: 'user' };
        return jsonwebtoken.sign(payload, process.env.secret);
    }
}