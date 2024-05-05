const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads"); //destination folder for my uploads
  },
  filename: function (req, file, cb) {
    const uniqueFileName = uuidv4(); //generate a unique fileName
    cb(null, uniqueFileName + path.extname(file.originalname)); //unique file name for uploaded file
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
