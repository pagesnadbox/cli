
// build

// 1. copy resources to cwd
// 2. merge with app config
// 2. write config.js to /project/dist folder

const fse = require('fs-extra')
const path = require('path')

const { readFile, writeFile, getProjectDir: getDir } = require('./models/utils')

const copyDist = async (dir) => {
    const templateDir = path.resolve(process.cwd(), "node_modules/pagesandbox-template/dist");
    await fse.copy(templateDir, `${dir}/dist`);
}

const mergeConfig = async (dir) => {
    const appConfigDir = `${dir}/appConfig.json`;
    const appConfigTargetDir = `${dir}/dist/config.js`;
    const config = await readFile(appConfigDir);
    const targetContent = `window.com = window.com || {};window.com.template.standalone = true;window.com.config = ${config};`;

    await writeFile(appConfigTargetDir, targetContent);
}

const copyImages = async (dir) => {
    await fse.copy(`${dir}/images`, `${dir}/dist/assets`);
}

const build = async () => {
    const dir = getDir();

    await copyDist(dir)
    await mergeConfig(dir)
    await copyImages(dir)
}

module.exports = {
    build
}