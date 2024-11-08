const multer = require("multer");

const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage });

module.exports = upload.single("file"); // Assuming the input name is 'file'
