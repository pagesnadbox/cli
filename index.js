const fs = require('fs');
const mime = require('mime')
const puppeteer = require('puppeteer');
const AdmZip = require('adm-zip');

const projects = require("./projects")

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

const createProjectUlr = `${apiDomain}projects/create`
const editProjectUlr = `${apiDomain}projects/edit`
const removeProjectUlr = `${apiDomain}projects/remove`
const listProjectsUlr = `${apiDomain}projects/list`

const getDir = (application) => `./node_modules/pagesandbox-${application}/dist/`

function handleFileRequest({ request, application, url, domain, onError }) {
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

    if (url.startsWith(listProjectsUlr)) {
      data = await projects.list();

    } else if (url.startsWith(editProjectUlr)) {

      data = await projects.edit(JSON.parse(postData));

    } else if (url.startsWith(removeProjectUlr)) {

      data = await projects.remove(JSON.parse(postData));

    } else if (url.startsWith(createProjectUlr)) {

      data = await projects.create(JSON.parse(postData));

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

  // await browser.close();
})();