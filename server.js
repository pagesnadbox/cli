#!/usr/bin/env node

const cors = require('cors');
const express = require('express');
const logger = require("morgan");

const app = express();
const port = 3000;

console.log(process.cwd())

app.use('/', express.static(process.cwd() + '/node_modules/pagesandbox-builder/dist/'));
app.use('/project', express.static(process.cwd() + '/node_modules/pagesandbox-builder/dist/'));
app.use('/template', express.static(process.cwd() + '/node_modules/pagesandbox-template/dist/'));

app.use(express.static("./project"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["http://192.168.1.4:8081", "http://localhost:8081", "https://nocodevue.gitlab.io", "https://dobfrontend.gitlab.io"],
    credentials: false
})
);

const projects = require("./models/projects/projects")
const configs = require("./models/configs/configs")
const images = require("./models/images/images")

const apiUrl = '/pagesandbox/api/v1'

// projects

app.post(`${apiUrl}/project/create`, async (req, res) => {
    const data = await projects.create(req.body);

    res.send(data);
})

app.post(`${apiUrl}/project/edit`, async (req, res) => {
    const data = await projects.edit(req.body);

    res.send(data);
})

app.post(`${apiUrl}/project/remove`, async (req, res) => {
    const data = await projects.remove(req.body);

    res.send(data);
})

app.get(`${apiUrl}/project`, async (req, res) => {
    const data = await projects.getSingle();

    res.send(data);
})

// configs

app.post(`${apiUrl}/project/config/save`, async (req, res) => {
    const data = await configs.save(req.body)

    res.send(data);
})

app.get(`${apiUrl}/project/config/fetch`, async (req, res) => {
    const data = await configs.fetch()

    res.send(data);
})

// images

app.post(`${apiUrl}/project/images/`, async (req, res) => {
    const imagesResult = await images.upload(req, res)

    const files = imagesResult.files.map(file => {
        return {
            fileName: file.filename
        };
    });

    const project = await projects.addImages({ images: files });

    res.send(project);
})

app.delete(`${apiUrl}/project/images/clear`, async (req, res) => {


    const project = await projects.edit({ images: [] });

    res.send(project);
})

// build

app.post(`${apiUrl}/project/build`, async (req, res) => {
    const project = await projects.build();

    res.send(project);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});