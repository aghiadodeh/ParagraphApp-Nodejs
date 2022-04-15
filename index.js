'use strict';
require('dotenv').config();
import express from 'express';
import http from 'http';
import colors from "colors";
import appMiddlware from "./libs/middlewares/middleware";
import routeMiddleware from "./libs/middlewares/routeMiddleware";
import fs from 'fs';
import ipAddress from "./libs/helpers/ipAddress";
import mongoose from 'mongoose';

const mongoPath = process.env.local_mongodb;
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.mongo_DB_NAME || 'Todo_DB',
};

const uploadDir = "./uploads";
const dirs = [
    uploadDir,
    `${uploadDir}/files`,
    `${uploadDir}/images`,
    `${uploadDir}/temp`,
    `./private`,
    `./private/logger`,
];

dirs.forEach(dir => { if (!fs.existsSync(dir)) fs.mkdirSync(dir); });

const app = express();
appMiddlware(app);
const httpServer = http.createServer(app);

routeMiddleware(app);

mongoose.Promise = global.Promise;
mongoose.connect(mongoPath, mongoOptions).then(result => {
    console.log("Mongoose Connected: ".magenta + "Success".green + " on ".magenta + mongoPath.blue);
}).catch(error => {
    console.log("Mongoose Connected: ".magenta + `Error: ${error}`.red);
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(
        `Server is Running on `.cyan +
        `${ipAddress.getIpAddress()}:${PORT}`.magenta +
        ` NODE_ENV:`.green +
        ` ${process.env.NODE_ENV || 'development'}`.yellow
    );
});