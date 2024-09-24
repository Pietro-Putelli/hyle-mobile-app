export const extractShortUrl = (url: string) => {
  const matches = url.match(
    /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/gim,
  );

  if (matches && matches.length > 1) {
    return matches[1].replace('www.', '');
  }
  return url.replace('https://', '');
};

export const getFavIconUrl = (shortUrl: string) => {
  return `https://s2.googleusercontent.com/s2/favicons?sz=64&domain=${shortUrl}`;
};
