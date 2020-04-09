class PortugueseAudioService {

  constructor(browserService) {
    this.browserService = browserService;
  }

  /*
  *@return {url: '', title: ''}
  */

  async fetch() {
    const podcastUrl = 'https://www.buzzsprout.com/964621';

    await this.browserService.start();
    await this.browserService.navigate(podcastUrl);

    const latestEpisodePageAddress = await this.browserService.querySelector('.episode-list--play', a => a.href);

    await this.browserService.navigate(latestEpisodePageAddress);

    const url = await this.browserService.querySelector('audio', audio => audio.src);
    const title = await this.browserService.querySelector('.episode__title', h1 => h1.innerText);

    await this.browserService.close();

    return { url, title };
  }
}

module.exports = { PortugueseAudioService };
