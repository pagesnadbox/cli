const fs = require("fs").promises

const { readFile } = require("../utils");
const ImageService = require("./multer")

/**
 * 
 * @param {*} payload 
 * @returns 
 */
const upload = async (payload) => {
    try {
        const { id, files } = payload;

        if (!id) {
            throw new Error("parameter id is required")
        }

        if (!files || (files && !files.length)) {
            throw new Error("parameter files is required and should not be empty")
        }

        const dir = `projects/${id}/images`

        await ImageService.upload({
            dir,
            files
        }, (error) => {
            throw new Error(error.message)
        });

        return {
            dir,
            files,
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