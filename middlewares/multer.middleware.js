/* const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/temp"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
 */

const multer = require("multer");

// Use memory storage instead of disk storage
const storage = multer.memoryStorage(); // Store file in memory

const upload = multer({ storage: storage });

module.exports = upload;
