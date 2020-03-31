const puppeteer = require('puppeteer');

class PortugueseLessonService {
  async fetch(formattedDate) {
    const url = 'https://mais.cpb.com.br/licao-adultos/';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    page.click('cpbm-card:first-of-type');
    await page.waitForNavigation({ waitUntil: 'load' });

    const title = await page.$('.mdl-typography--headline');
    const titleText = `*[${formattedDate}] ${await page.evaluate(element => element.textContent, title)}*`;

    const currentDayId = this.getCurrentLessonDayId();
    const contentElements = await page.$$(`${currentDayId} div.conteudoLicaoDia p`);

    let content = '';

    if (currentDayId === '#licaoSabado') {
      const verso = await page.$('.versoMemorizarLicao');
      content += await page.evaluate(element => element.textContent, verso);

      const leiturasSemana = await page.$('.leiturasSemanaLicao');
      content += await page.evaluate(element => element.textContent, leiturasSemana);

      content = this.sanitizeText(content);
    }

    for (const contentElement of contentElements) {
      const currentText = await page.evaluate(el => el.innerText, contentElement);
      if (currentText.replace(/_/gi, '').trim())
        content += this.sanitizeText(currentText.trim());
      else
        content += ' ';
    }

    await browser.close();

    return { title: titleText, content };
  }

  getCurrentLessonDayId() {
    const currentDay = new Date().getDay();
    const weekDay = (['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'])[currentDay];
    return `#licao${weekDay}`;
  }

  sanitizeText(currentText) {
    return currentText.replace((/\t/gi), '').replace((/\n/gi), '');
  }
}

module.exports = { PortugueseLessonService };
