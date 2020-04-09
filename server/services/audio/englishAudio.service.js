const fetch = require('node-fetch');

class EnglishAudioService {
  async fetch() {
    const response$ = await fetch('https://api.spreaker.com/show/3096019/episodes/playlist?sorting=newest');
    const { response } = await response$.json();
    const { items } = response.playlist;

    for (const item of items) {
      const itemResponse$ = await fetch(item.api_url);
      const itemResponse = await itemResponse$.json();
      const { episode } = itemResponse.response;

      if (episode.title.indexOf('Sabbath School') > -1) {
        return { url: episode.download_url, title: episode.title };
      }
    }
  }
}

module.exports = { EnglishAudioService };
