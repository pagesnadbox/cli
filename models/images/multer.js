const multer = require("multer");

/**
 * Check File Type
 * @param {*} file 
 * @param {*} cb 
 * @returns 
 */
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|svg/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb("Error: Images Only!");
    }
}

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = `./public/uploads/${req.__file_id}/`;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        cb(null, dir);
    },
    filename: function (req, file, cb) {
        console.error(file)
        cb(null, file.originalname);
    },
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
}).array("files", 10);

module.exports = {
    upload
}