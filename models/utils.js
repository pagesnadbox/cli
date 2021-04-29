const fs = require("fs").promises;
const path = require("path");

/**
 * 
 * @param {*} path 
 * @param {*} encoding 
 * @returns 
 */
const readFile = (path, encoding = 'utf-8') => {
    try {
        return fs.readFile(path, encoding);
    } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
    }
}

/**
 * 
 * @param {*} path 
 * @param {*} content 
 */
const writeFile = (path, content) => {
    try {
        return fs.writeFile(path, content);
    } catch (error) {
        console.error(`Got an error trying to write the file: ${error.message}`);
    }
}

const getProjectDir = () => {
    console.log(process.cwd())
    return path.resolve(process.cwd(), `project`)
}

module.exports = {
    readFile,
    writeFile,
    getProjectDir
}