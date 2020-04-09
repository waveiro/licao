const { sanitizeText } = require('../../utils/text.utils');
const moment = require('moment');

class EnglishLessonService {
  constructor(browserService) {
    this.browserService = browserService;
  }

  async fetch(formattedDate) {
    const lessonCode = this.generateLessonCode();
    const lessonUrl = `https://absg.adventist.org/html?code=${lessonCode}`;

    await this.browserService.start();
    await this.browserService.navigate(lessonUrl);

    const { selector, weekDay } = this.getCurrentLessonDaySelector();
    let heading;
    let additionalContent = '';

    if (weekDay === 'sab') {
      heading = await this.browserService.querySelector('#lesson-title', e => e.innerText.trim());

      const additionalContentElements = await this.browserService.querySelectorAll(`${selector} h3`,
        h3s => h3s.map(h3 => h3.innerText.trim()));
      additionalContentElements.forEach(content => additionalContent += sanitizeText(content));

    } else if (weekDay === 'fri') {
      heading = 'Further Thought';
    } else {
      heading = await this.browserService.querySelector(`${selector} h2:nth-child(2)`, e => e.innerText.trim());
    }

    const title = `*[${formattedDate}] ${heading}*`;

    let content = '';

    const lessonContentElements = await this.browserService.querySelectorAll(`${selector}>:not(h2) `,
      elements => elements.map(element => element.innerText.trim()));

    lessonContentElements.forEach(contentPiece => content += sanitizeText(contentPiece));

    await this.browserService.close();

    return { title, content };
  }

  getCurrentLessonDaySelector() {
    const currentDay = new Date().getDay();
    const nthChild = (['2', '3', '4', '5', '6', '7', '1'])[currentDay];
    const weekDay = (['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sab'])[currentDay];
    return { selector: `.page:nth-child(${nthChild})`, weekDay };
  }

  /*
  * Code generated will be like this:
  * ADLT2Q20WK02LESN
  * ADLT = Adults
  * XQ = Number + Quarter
  * XX = Year (YY)
  * WKXX = Week + Number(2)
  * LESN
  */
  generateLessonCode() {
    let code = 'ADLT';
    const today = moment();

    code += `${today.quarter()}Q`;
    code += today.format('YY');

    const currentWeek = Number(today.format('W')) - (Number(today.quarter() - 1) * 13);
    code += `WK${currentWeek.toString().padStart(2, '0')}`;

    code += 'LESN';

    return code;
  }
}

module.exports = { EnglishLessonService };
