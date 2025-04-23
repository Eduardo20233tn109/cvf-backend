const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Asegura que la carpeta "uploads" exista
const storagePath = "./uploads";
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storagePath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = Date.now() + ext;
    cb(null, name);
  },
});

const upload = multer({ storage });

module.exports = upload;
