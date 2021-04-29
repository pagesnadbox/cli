const fs = require("fs").promises;

const appConfig = require("../../appConfig");
const { readFile, getProjectDir: getDir } = require("../utils");
const { build: buildProject } = require("../../build");

const getProject = async () => {
    const dir = getDir();

    let projectConfig = await readFile(`${dir}/projectConfig.json`);

    return JSON.parse(projectConfig)
}

const setProject = async (project) => {
    const dir = getDir();

    await fs.writeFile(`${dir}/projectConfig.json`, JSON.stringify(project));
}

/**
 * 
 * @param {*} payload 
 * @returns 
 */
const create = async (payload) => {
    try {
        const dir = getDir();

        const project = { ...payload, images: [] }

        try {
            await fs.access(dir)
        } catch (error) {
            await fs.mkdir(dir);
        }

        await fs.mkdir(`${dir}/images`);
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
        let project = await getProject();

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

const getSingle = async () => {
    try {
        let project = await getProject();

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

const addImages = async ({ images = [] }) => {
    try {
        if (!images.length) {
            throw new Error("please provide images");
        }

        let project = await getProject();
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

const remove = async () => {
    try {
        const dir = getDir();
        await fs.rmdir(dir, { recursive: true });

        return {
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

const build = async () => {
    try {
        await buildProject();

        return {
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
    getSingle,
    create,
    edit,
    remove,
    // images
    addImages,
    //
    build
}