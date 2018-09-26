const http = require("http");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const express = require("express");

const app = express();
const httpServer = http.createServer(app);

const util = require('./utilities.js');
const PORT = process.env.PORT || 3000;


httpServer.listen(3000, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// put the HTML file containing your form in a directory named "public" (relative to where this script is located)
app.get("/", express.static(path.join(__dirname, "./public")));

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("ERR!" + err);
};

const upload = multer({
  dest: "/home/turbin/Documents/uploadedimages" //enter path here - will be moved to config file
});


app.post(
  "/upload",
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {

    if(!util.checkExt(path.extname(req.file.originalname))){
      res.status(403).end('Only .bmp/.png/.jpg files can be resized');
    }

    const filePath = req.file.path+path.extname(req.file.originalname)

      fs.rename(req.file.path, filePath, err => {
        if (err) return handleError(err, res);
        util.pythonHandler(req,res,filePath)
      });

  }
);

// save code as start.js
