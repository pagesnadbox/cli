const fs = require('fs');
const mime = require('mime')
const puppeteer = require('puppeteer');
const AdmZip = require('adm-zip');

const projects = require("./projects")
const configs = require("./configs")

const config = {
  args: [],
  headless: false,
  defaultViewport: null,
  devtools: false,
  executablePath: '/usr/bin/google-chrome-stable'
};

const devDomain = `http://localhost:8081/`;
const builderDomain = `http://pagesandox_builder.dev/`;
const apiDomain = `${devDomain}pagesandbox/api/v1/`;

const templateDomain = `http://localhost:8080/`;

const uploadImagesUrl = `${builderDomain}upload/images`;
const downloadUrl = `${builderDomain}download/zip`;
const builderUrl = `${builderDomain}`;

const createProject = `${apiDomain}projects/create`
const editProject = `${apiDomain}projects/edit`
const removeProject = `${apiDomain}projects/remove`
const listProjects = `${apiDomain}projects/list`

const saveProjectConfig = `${apiDomain}projects/config/save`
const fetchProjectConfig = `${apiDomain}projects/config/fetch`

const getDir = (application) => `./node_modules/pagesandbox-${application}/dist/`

function handleFileRequest({ application, url, domain, onError }) {
  const requestedFile = url.substring(domain.length) || 'index.html'
  const contentType = mime.getType(requestedFile)

  console.log(`requesting ${application} file`, requestedFile, contentType);

  let body;
  let buffer;
  let isImage = contentType.indexOf('image') > -1
  let encoding = isImage ? 'base64' : 'utf8'

  try {
    body = fs.readFileSync(`${getDir(application)}${requestedFile}`, encoding)
  } catch (e) {
    onError && onError(e)
  }

  if (isImage) {
    buffer = Buffer.from(body, encoding);
  }

  return {
    body,
    buffer,
    contentType
  }
}

(async () => {
  const browser = await puppeteer.launch(config);
  const page = (await browser.pages())[0];

  page.setCacheEnabled(false);
  page.setRequestInterception(true);

  page.on("request", async (request) => {
    const onError = () => request.continue();
    let data

    const url = request.url()

    const postData = request.postData()

    if (url.startsWith(listProjects)) {
      // LIST
      data = await projects.list();
    } else if (url.startsWith(editProject)) {
      // EDIT
      data = await projects.edit(JSON.parse(postData));
    } else if (url.startsWith(removeProject)) {
      // REMOVE
      data = await projects.remove(JSON.parse(postData));
    } else if (url.startsWith(createProject)) {
      // CREATE
      data = await projects.create(JSON.parse(postData));
    } else if (url.startsWith(saveProjectConfig)) {
      // SAVE CONFIG
      data = await configs.save(JSON.parse(postData))
    } else if (url.startsWith(fetchProjectConfig)) {
      // FETCH CONFIG
      const id = url.substring(fetchProjectConfig.length)
      data = await configs.fetch({ id })
    } else if (url.startsWith(builderDomain)) {

      data = handleFileRequest({ url, request, application: "builder", domain: builderDomain, onError })

    } else if (url.startsWith(templateDomain)) {

      data = handleFileRequest({ url, request, application: "template", domain: templateDomain, onError })

    } else if (url.startsWith(downloadUrl)) {

      const file = new AdmZip(`${getDir("builder")}dist.zip`);

    } else if (url.startsWith(uploadImagesUrl)) {

    } else {
      return request.continue();
    }

    const { body, buffer, contentType = "application/json" } = data;

    await request.respond({
      body: buffer || body,
      status: 200,
      contentLength: body.length,
      contentType
    })

  })

  await page.goto(devDomain).catch(e => console.error(e));

})();