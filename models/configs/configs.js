const fs = require("fs").promises

const { readFile, getProjectDir: getDir } = require("../utils");

/**
 * 
 * @param {*} payload 
 * @returns 
 */
const save = async (payload) => {
    try {
        const { id, config } = payload;

        if (!id) {
            throw new Error("parameter id is required");
        }

        if (!config) {
            throw new Error("parameter config is required");
        }

        const dir = getDir(id);

        await fs.writeFile(`${dir}/appConfig.json`, JSON.stringify(config));

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

/**
 * 
 * @param {*} payload 
 * @returns 
 */
const fetch = async (payload) => {
    try {
        const { id } = payload;

        const dir = getDir(id)

        let config = await readFile(`${dir}/appConfig.json`);
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
    save,
    fetch,
}