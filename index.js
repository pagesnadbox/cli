const puppeteer = require('puppeteer');

const config = {
  args: [],
  headless: false,
  defaultViewport: null,
  devtools: false,
  executablePath: '/usr/bin/google-chrome-stable'
};

const builderDomain = `http://localhost:3000/`;

(async () => {
  const browser = await puppeteer.launch(config);
  const page = (await browser.pages())[0];

  page.setCacheEnabled(false)

  await page.goto(builderDomain).catch(e => console.error(e));

})();