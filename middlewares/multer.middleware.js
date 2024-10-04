const multer = require("multer");

// Use memory storage instead of disk storage
const storage = multer.memoryStorage(); // Store file in memory

const upload = multer({ storage: storage });

module.exports = upload;
