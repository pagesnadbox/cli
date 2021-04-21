const cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: ["http://192.168.1.10:8080", "http://localhost:8081", "https://nocodevue.gitlab.io", "https://dobfrontend.gitlab.io"],
    credentials: false
})
);

const projects = require("./projects")
const configs = require("./configs")

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

// configs

app.post(`${apiUrl}/projects/config/save`, async (req, res) => {
    const data = await configs.save(req.body)

    res.send(data);
})

app.get(`${apiUrl}/projects/config/fetch/:id`, async (req, res) => {
    const data = await configs.fetch({ id: req.params.id })

    res.send(data);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});