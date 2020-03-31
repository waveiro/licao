const { PortugueseAudioService } = require('./services/portugueseAudio.service');
const { EnglishAudioService } = require('./services/englishAudio.service');
const { PortugueseLessonService } = require('./services/portugueseLesson.service');
const { EnglishLessonService } = require('./services/englishLesson.service');
const puppeteer = require('puppeteer');

// (async () => {
//   const formattedDate = new Intl.DateTimeFormat('pt-BR').format(new Date());
//
//   const portugueseLessonService = new PortugueseLessonService();
//   await portugueseLessonService.fetch(formattedDate);
//
//   const englishLessonService = new EnglishLessonService();
//   await englishLessonService.fetch(formattedDate);
//
//   const englishAudioService = new EnglishAudioService();
//   await englishAudioService.fetch();
//
//   const portugueseAudioService = new PortugueseAudioService();
//   await portugueseAudioService.fetch();
// })();

const express = require('express');
const app = express();
const port = 3000;

app.get('/licao', async (req, res) => {
  const formattedDate = new Intl.DateTimeFormat('pt-BR').format(new Date());

  const portugueseLessonService = new PortugueseLessonService();
  const lessonPortuguese = await portugueseLessonService.fetch(formattedDate);

  const englishLessonService = new EnglishLessonService();
  const lessonEnglish = await englishLessonService.fetch(formattedDate);

  const englishAudioService = new EnglishAudioService();
  const audioEnglish = await englishAudioService.fetch();

  const portugueseAudioService = new PortugueseAudioService();
  const audioPortuguese = await portugueseAudioService.fetch();

  res.send({
    pt: {
      lesson: lessonPortuguese,
      audio: audioPortuguese
    },
    en: {
      lesson: lessonEnglish,
      audio: audioEnglish
    }
  });
});

app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
