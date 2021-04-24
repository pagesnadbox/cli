const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { getProjectDir: getDir } = require("../utils");

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
        try {
            var dir = `${getDir(req.params.id)}/images`

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
    
            cb(null, dir);
        } catch (error) {
            cb(error);
        }

    },
    filename: function (req, file, cb) {
        console.error(file)
        cb(null, file.originalname);
    },
});

// Init Upload
const multerUpload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
}).array("files", 10);

const upload = (req, res, next) => {
    return new Promise((resolve, reject) => {
        multerUpload(req, res, (err) => {
            if (err) {
                reject(err)
            } else if (!req.files || (req.files && !req.files.length)) {
                reject(new Error("parameter files is required"))
            } else {
                resolve({
                    files: req.files
                })
            }
        })
    })
}

module.exports = {
    upload
}