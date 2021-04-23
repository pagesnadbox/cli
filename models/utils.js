const fs = require("fs").promises;
const path = require("path");

/**
 * 
 * @param {*} filePath 
 * @param {*} encoding 
 * @returns 
 */
const readFile = (filePath, encoding = 'utf-8') => {
    try {
        return fs.readFile(filePath, encoding);
    } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
    }
}

/**
 * 
 * @param {*} id 
 * @returns 
 */
const getProjectDir = (id = '') => {
    return path.resolve(__dirname, `../projects/${id}`)
}

module.exports = {
    readFile,
    getProjectDir
}