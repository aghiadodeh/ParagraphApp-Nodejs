'use strict'
import express from "express";
import Constants from "../config/constants";
import ResponseHelper from '../helpers/ResponseHelper';
import verifyToken from '../middlewares/jwtMiddleware';
import logger from '../middlewares/winston';
import Paragraph from "../models/Paragraph";
import ParagraphService from "../services/ParagraphService";
const router = express.Router();

router.post('/add-comments', verifyToken([Constants.roles.user]), async (req, res) => {
    try {
        const dummyTexts = [
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.Aenean commodo ligula eget dolor💙",
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,\n totam rem😉",
            "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure? On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee💙",
            "Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc, litot",
            "The European languages are members of the same family. Their separate existence is a myth. For science, music, sport, etc, ",
            "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated",
            "A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with",
            "One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin.",
            "The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz",
        ]

        const paragraph = await Paragraph.find({}).sort({ 'createdAt': -1 }).then(result => result[0]);
        for (var i = 0; i < 200; i++) {
            const body = {
                paragraph: paragraph._id,
                comment: dummyTexts[Math.floor(Math.random() * dummyTexts.length)] // random text
            };
            await ParagraphService.addComment(req.id, body, []);
        }

        return res.status(200).json(ResponseHelper.successResponse("done"));
    } catch (error) {
        console.log(error);
        logger.error(error);
        return res.status(200).json(ResponseHelper.badResponse(error.message));
    }
});


router.post('/add-paragraphs', verifyToken([Constants.roles.user]), async (req, res) => {
    try {
        const dummyTexts = [
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.Aenean commodo ligula eget dolor💙",
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,\n totam rem😉",
            "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure? On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee💙",
            "Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc, litot",
            "The European languages are members of the same family. Their separate existence is a myth. For science, music, sport, etc, ",
            "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated",
            "A wonderful serenity has #taken #possession of my entire soul, like these sweet mornings of spring which I enjoy with",
            "One morning, when #Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin.",
            "The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz",
        ]
        for (var i = 0; i < 200; i++) {
            const body = {
                title: dummyTexts[Math.floor(Math.random() * dummyTexts.length)], // random text
                description: dummyTexts[Math.floor(Math.random() * dummyTexts.length)] // random text
            };
            await ParagraphService.createParagraph(req.id, body, []);
        }

        return res.status(200).json(ResponseHelper.successResponse("done"));
    } catch (error) {
        console.log(error);
        logger.error(error);
        return res.status(200).json(ResponseHelper.badResponse(error.message));
    }
});


export default router;