const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

const appConfig = require("../../appConfig");
const { readFile, getProjectDir: getDir } = require("../utils");

/**
 * 
 * @param {*} payload 
 * @returns 
 */
const create = async (payload) => {
    try {
        const id = uuidv4();
        const dir = getDir(id);
        const project = { ...payload, id }

        await fs.mkdir(dir);
        await fs.writeFile(`${dir}/appConfig.json`, JSON.stringify(appConfig));
        await fs.writeFile(`${dir}/projectConfig.json`, JSON.stringify(project));

        return {
            success: true,
            ...project
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
const edit = async (payload) => {
    try {
        const { id, title, description } = payload;
        const dir = getDir(id);

        await fs.writeFile(`${dir}/projectConfig.json`, JSON.stringify({ id, title, description }));

        return {
            id,
            title,
            description,
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
 * @returns 
 */
const list = async () => {
    try {
        const projects = {};

        const content = await fs.readdir(getDir());

        for (const projectId of content) {
            const dir = getDir(projectId);

            const pathStats = await fs.lstat(dir)

            if (!pathStats.isDirectory()) {
                continue;
            }

            if (!projects[projectId]) {
                projects[projectId] = {}
            }

            const projectConfig = await readFile(`${dir}/projectConfig.json`);
            console.error(dir)
            projects[projectId].projectConfig = JSON.parse(projectConfig);

            const appConfig = await readFile(`${dir}/appConfig.json`);
            projects[projectId].appConfig = JSON.parse(appConfig);
        }

        return {
            success: true,
            projects
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
const remove = async (payload) => {
    try {
        const { id } = payload;

        const dir = getDir(id);
        await fs.rmdir(dir, { recursive: true });

        return {
            success: true,
            id
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
    create,
    edit,
    list,
    remove
}