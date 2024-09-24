import apiHandler from '..';
import ErrorHandler from '../error';
import {AIUrls} from '../urls';

const errorHandler = new ErrorHandler('AI-API');

class AiAPI {
  /* Starting from a params.content it enhances the content written by the user. */
  static sharpPick = (params: SharpPickGetParams, callback: Callback) => {
    apiHandler.get(
      {
        url: AIUrls.SharpPick,
        config: {params},
      },
      ({response, error}) => {
        if (error) {
          errorHandler.newError(error);
          return;
        }

        callback(response?.data);
      },
    );
  };

  /* Starting from a keyword in a pick, it generates a content for it. */
  static getKeywordDetails = (
    params: KeywordDetailsGetParams,
    callback: Callback,
  ) => {
    apiHandler.get(
      {
        url: AIUrls.KeywordDetail,
        config: {params},
      },
      ({response, error}) => {
        if (error) {
          errorHandler.newError(error);
          return;
        }

        callback(response?.data);
      },
    );
  };

  /* Get word translation and definition */
  static getWordTranslation = (
    params: WordTranslationGetParams,
    callback: Callback,
  ) => {
    apiHandler.get(
      {
        url: AIUrls.WordTranslation,
        config: {params},
      },
      ({response, error}) => {
        if (error) {
          errorHandler.newError(error);
          return;
        }

        callback(response?.data);
      },
    );
  };
}

export default AiAPI;
