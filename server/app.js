const { CacheService } = require('./services/configuration/cache.service');

const { BrowserService } = require('./services/configuration/browser.service');

const { PortugueseAudioService } = require('./services/audio/portugueseAudio.service');
const { EnglishAudioService } = require('./services/audio/englishAudio.service');
const { PortugueseLessonService } = require('./services/lesson/portugueseLesson.service');
const { EnglishLessonService } = require('./services/lesson/englishLesson.service');

const express = require('express');
const app = express();
const port = 3000;

app.get('/licao', async (req, res) => {
  let response;
  const cacheService = new CacheService();
  const formattedDate = new Intl.DateTimeFormat('pt-BR').format(new Date());

  if(cacheService.has(formattedDate)){
    response = cacheService.get(formattedDate);
    res.send(response);
    return;
  }


  const browserService = new BrowserService();

  const portugueseLessonService = new PortugueseLessonService(browserService);
  const lessonPortuguese = await portugueseLessonService.fetch(formattedDate);

  const portugueseAudioService = new PortugueseAudioService(browserService);
  const audioPortuguese = await portugueseAudioService.fetch();

  const englishLessonService = new EnglishLessonService(browserService);
  const lessonEnglish = await englishLessonService.fetch(formattedDate);

  const englishAudioService = new EnglishAudioService();
  const audioEnglish = await englishAudioService.fetch();

  response = {
    pt: {
      lesson: lessonPortuguese,
      audio: audioPortuguese
    },
    en: {
      lesson: lessonEnglish,
      audio: audioEnglish
    }
  };

  cacheService.set(formattedDate, response);
  res.send(response);
});

app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
