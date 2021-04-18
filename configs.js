const fs = require("fs").promises

const readFile = (filePath, encoding = 'utf-8') => {
    try {
        return fs.readFile(filePath, encoding);
    } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
    }
}

const save = async (payload) => {
    try {
        const { id, config } = payload;

        if (!id) {
            throw new Error("parameter id is required")
        }

        if (!config) {
            throw new Error("parameter config is required")
        }

        const dir = `projects/${id}`

        await fs.writeFile(`${dir}/appConfig.json`, JSON.stringify(config));

        return {
            body: JSON.stringify({
                id,
                config,
                success: true,
            })
        }

    } catch (error) {
        console.error(error);
        return {
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        }

    }
}

const fetch = async (payload) => {
    try {
        const { id } = payload;

        let config = await readFile(`./projects/${id}/appConfig.json`);
        config = JSON.parse(config);

        return {
            body: JSON.stringify({
                id,
                config,
                success: true,
            })
        }

    } catch (error) {
        console.error(error);
        return {
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        }

    }
}

module.exports = {
    save,
    fetch,
}