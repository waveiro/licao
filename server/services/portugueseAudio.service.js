const puppeteer = require('puppeteer');

class PortugueseAudioService {

  async fetch() {
    const url = 'https://www.youtube.com/user/lsquadros1/videos';
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const firstVideo = (await page.$$('ytd-grid-video-renderer:nth-child(1)'))[1];

    const elementInfo = await page.evaluate(() => {
      const videos = document.querySelectorAll('#items ytd-grid-video-renderer');
      let selectedVideo;

      for (let video of videos) {
        const textContent = video.querySelector('#video-title').textContent;
        const href = video.querySelector('#video-title').href;

        if (textContent.indexOf('Lição') > -1) {
          selectedVideo = {
            textContent,
            href
          };
          break;
        }
      }

      return selectedVideo;
    }, firstVideo);

    const ytmp3Url = 'https://ytmp3.cc/en13/';

    await page.goto(ytmp3Url, { waitUntil: 'networkidle2' });

    const audioUrl = await page.evaluate((elementInfo) => {
      document.querySelector('#input').value = elementInfo.href;
      document.querySelector('#submit').click();

      return new Promise((resolve, reject) => {
        function waitForLink() {
          const link = document.querySelector('#buttons > a[rel=nofollow][href*="http"]');
          if (link) {
            resolve(link.href);
          }

          setTimeout(waitForLink, 500);
        }

        waitForLink();
      });
    }, elementInfo);

    await browser.close();

    return { url: audioUrl, title: elementInfo.textContent };
  }
}

module.exports = { PortugueseAudioService };
