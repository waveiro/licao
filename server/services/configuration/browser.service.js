const puppeteer = require('puppeteer');

class BrowserService {

  async start() {
    if (this.browser) {
      await this.close();
    }

    this.browser = await puppeteer.launch();
  }

  async navigate(url) {
    this.page = await this.browser.newPage();
    await this.page.goto(url, { waitUntil: 'networkidle2' });
  }

  async pageClick(selector, waitUntil) {
    await this.page.click(selector);
    await this.page.waitForNavigation({ waitUntil });
  }

  async querySelector(selector, callback) {
    return await this.page.$eval(selector, callback);
  }

  async querySelectorAll(selector, callback) {
    return await this.page.$$eval(selector, callback);
  }

  async close() {
    this.browser.close();
    this.browser = null;
  }
}

module.exports = { BrowserService };
