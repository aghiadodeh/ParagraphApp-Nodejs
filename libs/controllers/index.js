'use strict';
import express from 'express';
const router = express.Router();

router.use('/users', require('./userController').default);
router.use('/paragraphs', require('./paragraphController').default);
router.use('/dummy', require('./dummyDataController').default);

export default router;
