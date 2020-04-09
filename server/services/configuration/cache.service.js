const fs = require('fs');
const path = require('path');

function sanitizeDateToFileName(date) {
  return date.replace(/\//g, '-');
}

class CacheService {
  constructor() {
    this.cachePath = path.join(__dirname, '..', '..', 'cache');
  }

  has(date) {
    return fs.existsSync(path.join(this.cachePath, `${sanitizeDateToFileName(date)}.json`));
  }

  set(date, response) {

    const data = new Uint8Array(
      Buffer.from(
        JSON.stringify(response)
      )
    );

    fs.writeFileSync(path.join(this.cachePath, `${sanitizeDateToFileName(date)}.json`), data);
  }

  get(date) {
    const content = fs.readFileSync(path.join(this.cachePath, `${sanitizeDateToFileName(date)}.json`));

    return JSON.parse(content);
  }

}

module.exports = { CacheService };
