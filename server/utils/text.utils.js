function sanitizeText(currentText) {
  return currentText.replace((/\t/gi), '') + '\n\n';
}

module.exports = { sanitizeText };
