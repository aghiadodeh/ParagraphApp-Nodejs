'use strict';
const multer = require('multer');
const fs = require('fs');
var path = require('path')
module.exports = function (folder = 'files') {
  const dir = `./uploads/${folder}`;
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    async filename(req, file, cb) {
      const name = uniqueName(file);
      cb(null, name);
    },
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: 1024 * 1024 * 350, // 350MB
    }
  });

  return upload;
}


function uniqueName(file) {
  const extention = path.extname(file.originalname);
  return `${(new Date()).getTime() + Math.random().toString(36).slice(2)}${extention}`;
}