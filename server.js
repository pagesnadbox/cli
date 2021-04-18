const cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

const projects = require("./projects")
const configs = require("./configs")

const apiUrl = '/pagesandbox/api/v1'

// projects

app.post(`${apiUrl}/projects/create`, async (req, res) => {
    const data = await projects.create(req.body);

    res.send(data);
})

app.post(`${apiUrl}/projects/edit`, async (req, res) => {
    console.log(req.body)
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

// configs

app.post(`${apiUrl}/projects/config/save`, async (req, res) => {
    const data = await configs.save(req.body)

    res.send(data);
})

app.get(`${apiUrl}/projects/config/fetch/:id`, async (req, res) => {
    const data = await configs.fetch({ id: req.params.id })
    console.error(data)

    res.send(data);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});