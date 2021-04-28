
// build

// 1. copy resources to cwd
// 2. merge with app config
// 2. write config.js to /projects/:id/dist folder

const fse = require('fs-extra')
const path = require('path')

const { readFile, writeFile, getProjectDir: getDir } = require('./models/utils')

const copyDist = async (dir) => {
    const templateDir = path.resolve(__dirname, "node_modules/pagesandbox-template/dist");
    await fse.copy(templateDir, `${dir}/dist`);
}

const mergeConfig = async (dir) => {
    const appConfigDir = `${dir}/appConfig.json`;
    const appConfigTargetDir = `${dir}/dist/config.js`;

    const config = await readFile(appConfigDir);
    const targetContent = `window.com = window.com || {};window.com.config = ${config};`;

    await writeFile(appConfigTargetDir, targetContent);
}

const copyImages = async (dir) => {
    try {
        await fse.copy(`${dir}/images`, `${dir}/dist/assets`);
    } catch (error) {
        console.error(error.message)
    }
}

const build = async (projectId) => {
    try {
        const dir = getDir(projectId);

        await copyDist(dir)
        await mergeConfig(dir)
        await copyImages(dir)

        console.log()

    } catch (error) {
        console.error(error);
        throw error;
    }
}

build("63385201-a91c-480d-8847-43f94a557634")

module.exports = {
    build
}