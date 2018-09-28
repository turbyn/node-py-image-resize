const path = require("path");
const fs = require("fs");
const multer = require("multer");

const express = require("express");
const app = express();

const util = require('./utilities.js');
const PORT = process.env.PORT || 3000;

let nconf = require("nconf")
nconf.file({ file: './config.json' });
util.configInit(nconf.get());

app.listen(3000, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.get("/", express.static(path.join(__dirname, "./public")));

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("ERR!" + err);
};
const upload = multer({
  dest: nconf.get('path'),
  limits: {
    fileSize: nconf.get('maxSizeBytes')
  }
});


app.post(
  "/upload",
  upload.single("file"),
  (req, res) => {
    if(!util.checkExt(path.extname(req.file.originalname))){
      res.status(403).end('Only .bmp/.png/.jpg files can be resized');
    }else if(util.checkSize(req.body, nconf.get())){
      res.status(403).end(`Request size is too large. Limit is x:${nconf.get().maxSizeX},y:${nconf.get().maxSizeY}`);
    }else{
    const filePath = req.file.path+path.extname(req.file.originalname)
      fs.rename(req.file.path, filePath, err => {
        if (err) return handleError(err, res);
        util.pythonHandler(req,res,filePath)
      });
    }
  }
);
