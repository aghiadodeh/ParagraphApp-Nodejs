'use strict'

import mongoose from "mongoose";
import Constants from "../config/constants";
import Paragraph from "../models/Paragraph";
import User from "../models/User";
import AttachmentService from "./AttachmentService";

export default {
    /**
     * insert new paragraph to database
     * @param {String} user user._id
     * @param {Object} paragraph paragraph object
     * @param {[Object]} files uploaded files
     * @returns {Paragraph} paragraph after saved in database 
     */
    createParagraph: async (user, paragraph, files) => {
        const attachments = AttachmentService.mappingAttachments(files);
        if (!paragraph.title) {
            throw new Error("title is required.");
        }
        if (!paragraph.description) {
            throw new Error("description is required.");
        }
        const tags = paragraph.description.match(/#\S+/g); // find all words contian `#`;
        return await Paragraph.create({
            user: user,
            title: paragraph.title,
            description: paragraph.description,
            tags: tags,
            attachments: attachments,
        }).then(result => {
            const leanObject = result.toObject();
            return leanObject;
        });
    },

    /**
     * get paragraphs list
     * @param {Object} condition filter objects
     * @param {Number} skip page number
     * @param {Number} perPage records count per page
     * @returns {Paragraph, int} pargraphs with total records
     */
    getParagraphs: async (condition, skip = 0, perPage = Constants.perPage) => {
        const paragraphs = await Paragraph.aggregate([
            { $match: condition },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    title: 1,
                    description: 1,
                    attachments: 1,
                    tags: 1,
                    commentsCount: { $size: "$comments" },
                    seenByCount: { $size: "$seenBy" },
                    createdAt: 1,
                },
            }, {
                $lookup: {
                    from: User.collection.name,
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [{ $project: { ...Constants.userSelect } }],
                },
            },
            { $unwind: "$user" },
            { $sort: { "createdAt": -1 } },
            { $skip: skip },
            { $limit: perPage },
        ]);

        const count = await Paragraph.count(condition);

        return { paragraphs, count };
    },

    /**
     * Add new user to paragraph seenBy list
     * @param {String} user user._id
     * @param {String} paragraph paragraph._id
     * @returns {Paragraph} paragraph after update
     */
    updateParagraphSeenBy: async (user, paragraph) => {
        return await Paragraph.findOneAndUpdate({
            _id: paragraph
        }, {
            seenBy: { $push: { user } }
        }, {
            new: true
        });
    },

    /**
     * add new comment to paragraph
     * @param {String} userId user._id
     * @param {Object} body req.body
     * @param {[Object]} files uploaded files
     * @returns {Comment} comment after saved in database
     */
    addComment: async (userId, body, files) => {
        if (!body.paragraph) {
            throw new Error("paragraph is required.");
        }
        if (!body.comment) {
            throw new Error("comment is required.");
        }
        const attachments = AttachmentService.mappingAttachments(files);
        const newComment = {
            user: userId,
            comment: body.comment,
            attachments: attachments,
        };

        const comment = await Paragraph.findOneAndUpdate({
            _id: body.paragraph
        }, {
            $push: { comments: newComment },
        }, {
            new: true
        }).select({ comments: { $slice: -1 } }).then(result => {
            const leanObject = result.toObject();
            // return last comment (inserted comment)
            return leanObject.comments[0];
        });

        return comment;
    },

    /**
     * remove comment from paragraph comments list
     * @param {Object} body req.body
     */
    deleteComment: async (body) => {
        if (!body.paragraph) {
            throw new Error("paragraph is required.");
        }
        if (!body.comment) {
            throw new Error("comment is required.");
        }
        await Paragraph.findOneAndUpdate({
            _id: body.paragraph
        }, {
            $pull: { comments: { _id: body.comment } },
        }, {
            new: true
        }).select({ comments: 1 });
        return "done";
    },

    /**
     * get paragraph comments list
     * @param {String} id paragraph._id
     * @param {Number} skip page number
     * @param {Number} perPage records count per page
     * @returns {[Comment]} paragraph comments list
     */
    getParagraphComments: async (id, skip = 0, perPage = Constants.perPage) => {
        if (!id) {
            throw new Error("paragraph is required.");
        }
        const paragraph = await Paragraph.findOne({
            _id: id
        }, {
            comments: { $slice: [skip, perPage] }
        })
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: Constants.userSelect
                }
            });

        return paragraph.comments;
    }
}

/**
 
 
*/