const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

const appConfig = require("../../appConfig");
const { readFile, getProjectDir: getDir } = require("../utils");

const getProject = async (id) => {
    if (!id) {
        throw new Error("parameter id is required")
    }

    const dir = getDir(id);

    let projectConfig = await readFile(`${dir}/projectConfig.json`);

    return JSON.parse(projectConfig)
}

const setProject = async (project) => {
    if (!project.id) {
        throw new Error("parameter id is required")
    }

    const dir = getDir(project.id);

    await fs.writeFile(`${dir}/projectConfig.json`, JSON.stringify(project));
}

/**
 * 
 * @param {*} payload 
 * @returns 
 */
const create = async (payload) => {
    try {
        const id = uuidv4();
        const dir = getDir(id);

        const project = { ...payload, id, images: [] }

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

const edit = async (payload) => {
    try {
        let project = await getProject(payload.id);

        project = {
            ...project,
            ...payload
        };

        await setProject(project);

        return {
            ...project,
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

const getSingle = async (payload) => {
    try {
        let project = await getProject(payload.id);

        return {
            ...project,
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

const addImages = async ({ id, images = [] }) => {
    try {
        if (!images.length) {
            throw new Error("please provide images");
        }

        let project = await getProject(id);
        const currentImages = project.images || [];

        images = images.filter(image => {
            return currentImages.findIndex(i => i.fileName === image.fileName) === -1
        })

        project = {
            ...project,
            images: [...currentImages, ...images]
        };

        await setProject(project);

        return {
            ...project,
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
    getSingle,
    create,
    edit,
    list,
    remove,
    // images
    addImages
}