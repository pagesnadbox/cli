const fs = require("fs").promises

const { readFile } = require("../utils");
const ImageService = require("./multer")

/**
 * 
 * @param {*} payload 
 * @returns 
 */
const upload = async (payload, req, res, next) => {
    try {
        const { id } = payload;

        if (!id) {
            throw new Error("parameter id is required")
        }

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

/**
 * 
 * @param {*} payload 
 * @returns 
 */
const fetch = async (payload) => {
    try {
        const { id } = payload;

        let config = await readFile(`./projects/${id}/appConfig.json`);
        config = JSON.parse(config);

        return {
            id,
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