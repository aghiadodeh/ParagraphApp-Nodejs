import path from 'path';
import express from 'express'
import apis from '../controllers/index';

export default function (app) {
    app.use('/api', apis);
    app.use('/uploads', express.static('uploads'));

    app.use((req, res, next) => {
        res.status(404);
        res.format({
            json() { res.json({ error: 'not found' }); },
            default() { res.type('txt').send('not found'); },
        });
    });
}
