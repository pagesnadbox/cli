const ImageService = require("./multer")

const upload = async (req, res) => {
    try {
        const result = await ImageService.upload(req, res);

        return {
            ...result,
            success: true,
        }

    } catch (error) {
        console.error(error);
        return {
            success: false,
            error: error.message
        }
    }
}

module.exports = {
    upload,
}