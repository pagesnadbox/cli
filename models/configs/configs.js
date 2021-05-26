const { writeFile, readFile, getProjectDir: getDir } = require("../utils");

const save = async (payload) => {
    try {
        const { config } = payload;

        if (!config) {
            throw new Error("parameter config is required");
        }

        const dir = getDir();

        await writeFile(`${dir}/appConfig.json`, JSON.stringify(config));

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

const fetch = async () => {
    try {
        const dir = getDir()

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
    save,
    fetch,
}