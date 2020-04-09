const { sanitizeText } = require('../../utils/text.utils');

class PortugueseLessonService {
  constructor(browserService) {
    this.browserService = browserService;
  }

  async fetch(formattedDate) {
    const lessonUrl = 'https://mais.cpb.com.br/licao-adultos/';

    await this.browserService.start();
    await this.browserService.navigate(lessonUrl);

    const currentLessonAddress = await this.browserService.querySelector('cpbm-card:first-of-type a', a => a.href);
    await this.browserService.navigate(currentLessonAddress);

    const currentDayId = this.getCurrentLessonDayId();
    const headlineContent = await this.browserService.querySelector(`${currentDayId} .mdl-typography--headline`, e => e.textContent);
    const title = `*[${formattedDate}] ${headlineContent}*`;

    const conteudoLicaoSelector = `${currentDayId} div.conteudoLicaoDia p`;
    const contentElements = await this.browserService.querySelectorAll(conteudoLicaoSelector,
      paragraphs => paragraphs.map(p => p.innerText));

    let content = '';

    if (currentDayId === '#licaoSabado') {
      const verso = await this.browserService.querySelector('.versoMemorizarLicao', e => e.textContent);
      content += verso;

      const leiturasSemana = await this.browserService.querySelector('.leiturasSemanaLicao', e => e.textContent);
      content += leiturasSemana;

      content = sanitizeText(content);
    }

    for (const contentElement of contentElements) {
      if (contentElement.replace(/_/gi, '').trim())
        content += sanitizeText(contentElement.trim());
      else
        content += ' ';
    }

    content = content.substr(0, content.length - 4);

    this.browserService.close();

    return { title: title, content };
  }

  getCurrentLessonDayId() {
    const currentDay = new Date().getDay();
    const weekDay = (['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'])[currentDay];
    return `#licao${weekDay}`;
  }
}

module.exports = { PortugueseLessonService };
