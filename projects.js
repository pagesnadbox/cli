const appConfig = require("./appConfig");
const { v4: uuidv4 } = require("uuid");

const fs = require("fs").promises;

const readFile = (filePath, encoding = 'utf-8') => {
    try {
        return fs.readFile(filePath, encoding);
    } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
    }
}


const create = async (payload) => {
    try {
        const id = uuidv4();
        const dir = `projects/${id}`

        const project = { ...payload, id }

        await fs.mkdir(dir);
        await fs.writeFile(`${dir}/appConfig.json`, JSON.stringify(appConfig));
        await fs.writeFile(`${dir}/projectConfig.json`, JSON.stringify(project));

        return {
            body: JSON.stringify({
                success: true,
                ...project
            })
        }

    } catch (error) {
        console.error(error);
        return JSON.stringify({
            success: false,
            error: error.message
        })
    }

}

const edit = async (payload) => {
    try {
        const { id, title, description } = payload;

        const dir = `projects/${id}`

        await fs.writeFile(`${dir}/projectConfig.json`, JSON.stringify({ id, title, description }));

        return {
            body: JSON.stringify({
                id,
                title,
                description,
                success: true,
            })
        }

    } catch (error) {
        console.error(error);
        return JSON.stringify({
            success: false,
            error: error.message
        })
    }
}

const list = async () => {
    try {
        const projects = {};

        const content = await fs.readdir("./projects")

        for (const projectId of content) {
            const pathStats = await fs.lstat(`./projects/${projectId}`)

            if (!pathStats.isDirectory()) {
                continue;
            }

            if (!projects[projectId]) {
                projects[projectId] = {}
            }

            const projectConfig = await readFile(`./projects/${projectId}/projectConfig.json`);
            projects[projectId].projectConfig = JSON.parse(projectConfig);

            const appConfig = await readFile(`./projects/${projectId}/appConfig.json`);
            projects[projectId].appConfig = JSON.parse(appConfig);
        }

        return {
            body: JSON.stringify({
                success: true,
                projects
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

const remove = async (payload) => {
    try {
        const { id } = payload;

        const dir = `projects/${id}`
        await fs.rmdir(dir, { recursive: true });

        return {
            body: JSON.stringify({
                success: true,
                id
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
    create,
    edit,
    list,
    remove
}