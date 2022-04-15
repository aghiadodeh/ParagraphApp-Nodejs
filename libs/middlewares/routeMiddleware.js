import path from 'path';
import express from 'express'
import apis from '../controllers/index';

export default function (app) {
    app.use('/api', apis);
    app.use('/uploads', express.static('uploads'));

    app.use((req, res, next) => {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.write('404 Not found');
        res.end();
    });
}
