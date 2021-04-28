#!/usr/bin/env node

const cors = require('cors');
const express = require('express');
const logger = require("morgan");

const app = express();
const port = 3000;


app.use('/', express.static(__dirname + '/node_modules/pagesandbox-builder/dist/'));
app.use('/projects/:id', express.static(__dirname + '/node_modules/pagesandbox-builder/dist/'));
app.use('/template', express.static(__dirname + '/node_modules/pagesandbox-template/dist/'));

app.use(express.static("./projects"));
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

app.post(`${apiUrl}/projects/create`, async (req, res) => {
    const data = await projects.create(req.body);

    res.send(data);
})

app.post(`${apiUrl}/projects/edit`, async (req, res) => {
    const data = await projects.edit(req.body);

    res.send(data);
})

app.post(`${apiUrl}/projects/remove`, async (req, res) => {
    const data = await projects.remove(req.body);

    res.send(data);
})

app.get(`${apiUrl}/projects/list`, async (req, res) => {
    const data = await projects.list();

    res.send(data);
})

app.get(`${apiUrl}/projects/:id`, async (req, res) => {
    const data = await projects.getSingle({ id: req.params.id });

    res.send(data);
})

// configs

app.post(`${apiUrl}/projects/config/save`, async (req, res) => {
    const data = await configs.save(req.body)

    res.send(data);
})

app.get(`${apiUrl}/projects/config/fetch/:id`, async (req, res) => {
    const data = await configs.fetch({ id: req.params.id })

    res.send(data);
})

// images

app.post(`${apiUrl}/projects/:id/images/`, async (req, res) => {
    const id = req.params.id;
    const imagesResult = await images.upload({ id }, req, res)

    const files = imagesResult.files.map(file => {
        return {
            fileName: file.filename
        };
    });

    const project = await projects.addImages({ id, images: files });

    res.send(project);
})

app.delete(`${apiUrl}/projects/:id/images/clear`, async (req, res) => {
    const id = req.params.id;

    const project = await projects.edit({ id, images: [] });

    res.send(project);
})

// build

app.post(`${apiUrl}/projects/:id/build`, async (req, res) => {
    const id = req.params.id;

    const project = await projects.build({ id });

    res.send(project);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});