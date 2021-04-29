
const { readFile, getProjectDir: getDir } = require("../utils");
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

const fetch = async () => {
    try {
        const dir = getDir();

        let config = await readFile(`${dir}/appConfig.json`);
        config = JSON.parse(config);

        return {
            config,
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
    fetch,
}