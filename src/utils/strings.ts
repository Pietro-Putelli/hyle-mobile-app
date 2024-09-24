export function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function cleanText(text: string): string {
  return text.replace(/[{}[\]()]/g, '');
}

export function generateUUID(digits: number = 8) {
  let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';
  let uuid = [];
  for (let i = 0; i < digits; i++) {
    uuid.push(str[Math.floor(Math.random() * str.length)]);
  }
  return uuid.join('');
}

export function removeUnusedLines(text: string) {
  return text
    .split(/\r?\n|\r/)
    .filter(line => line.trim() !== '')
    .join('');
}

export function trimBoundarySpaces(text: string): string | undefined {
  if (!text) {
    return undefined;
  }

  return text.replace(/^\s+|\s+$/g, '');
}
