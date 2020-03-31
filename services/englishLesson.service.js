const puppeteer = require('puppeteer');

class EnglishLessonService {
  async fetch(formattedDate) {
    const url = 'https://ssnet.org/lessons/current.html';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const currentDayId = this.getCurrentLessonDayId();

    let element = (await page.$$(currentDayId))[0];
    let tmpTitle;

    if (currentDayId === '#sab') {
      element = (await page.$$('h2'))[0];
      tmpTitle = (await page.evaluateHandle(el => el.textContent, element)).toString().replace('JSHandle:', '');

      element = (await page.$$(currentDayId))[0];
    } else if (currentDayId === '#fri') {
      element = await page.evaluateHandle(el => el.nextElementSibling, element); //title
      tmpTitle = await page.evaluate(element => ({
        textContent: element.querySelector('.a-emphasis').textContent
      }), element);

    } else {
      element = await page.evaluateHandle(el => el.nextElementSibling, element); //title
      tmpTitle = await page.evaluate(element => element.textContent, element);
    }

    const titleText = `*[${formattedDate}] ${tmpTitle}*`;

    let content = '';

    while (true) {
      element = await page.evaluateHandle(el => el.nextElementSibling, element); //title

      const elementInfo = await page.evaluate(element => ({
        textContent: element.textContent,
        id: element.id,
        tagName: element.tagName,
        classList: element.classList
      }), element);

      if (elementInfo.id) break;

      if (elementInfo.tagName.toLowerCase() === 'hr' || elementInfo.classList['0'] === 'study') continue;

      content += this.sanitizeText(` ${elementInfo.textContent.trim()}`);
    }

    content = content.trim().replace(/ {2,}/gim, ' ');

    await browser.close();

    return { title: titleText, content };
  }

  getCurrentLessonDayId() {
    const currentDay = new Date().getDay();
    const weekDay = (['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sab'])[currentDay];
    return `#${weekDay}`;
  }

  sanitizeText(currentText) {
    return currentText.replace((/\t/gi), '').replace((/\n/gi), '');
  }
}

module.exports = { EnglishLessonService };
