import Share from 'react-native-share';

// https://react-native-share.github.io/react-native-share/docs/share-open

const buildBookShareUrl = (book: any) => {
  return `https://feynmanapp.com/book/${book.guid}`;
};

const openShare = (params: any, callback?: () => void) => {
  Share.open({
    title: params.data.title,
    message: params.message,
    url: buildBookShareUrl(params.data),
  })
    .then(() => {
      callback?.();
    })
    .catch(err => {
      err && console.log(err);
    });
};

export default openShare;
