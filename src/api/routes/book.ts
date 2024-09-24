import {
  appendStateBookPick,
  createStateBook,
  deleteStateBook,
  setStateBookTopics,
} from '@/storage/slices/booksSlice';
import {formatCreatePickBody, formatEditPickBody} from '@/utils/formatters';
import apiHandler from '..';
import ErrorHandler from '../error';
import {BookUrls} from '../urls';
import {MiddlewareDispatch} from './../types/index';

const errorHandler = new ErrorHandler('BookAPI');

class BookAPI {
  /*
    Create a new book functionality is part of create a new pick, 
    since a book must have at least one pick.
  */
  static create =
    (requestData: CreatePickData, callback: ResponseStatusCallback) =>
    (dispatch: MiddlewareDispatch) => {
      const {bookId} = requestData;

      const body = formatCreatePickBody(requestData);

      console.log('Creating:', body);

      apiHandler.post(
        {url: BookUrls.Picks, data: body},
        ({response, error}) => {
          if (error) {
            errorHandler.newError(error);
            return;
          }

          const data = response?.data;
          const isSucceded = data != undefined;

          if (isSucceded) {
            callback(true);

            if (bookId == undefined) {
              dispatch(createStateBook(data));
            } else {
              dispatch(appendStateBookPick({bookId, pick: data}));
            }

            /* Refresh topics once a new book is added */
            dispatch(this.getTopics());
          }
        },
      );
    };

  /* 
    Get books using offset and limit.

    - offset: number
    - limit: number

    Short stands for getting only books with title and id.
    Long stands for getting all books with all fields.
    
    - type: "long" | "short" 
  */
  static getList = (params: BookGetParams, callback: Callback) => {
    apiHandler.get(
      {
        url: BookUrls.Books,
        config: {params},
      },
      ({response, error}) => {
        if (error) {
          errorHandler.newError(error);
          return;
        }

        const data = response?.data;

        callback({
          data,
          isSuccess: data !== undefined,
        });
      },
    );
  };

  /* Get book's detail using guid */
  static get = (guid: string, callback: Callback) => {
    apiHandler.get({url: `${BookUrls.Books}/${guid}`}, ({response, error}) => {
      if (error) {
        errorHandler.newError(error);
        return;
      }

      const data = response?.data;

      callback({isSuccess: data !== undefined, data});
    });
  };

  /* Delete book using guid */
  static delete =
    (guid: string, callback: ResponseStatusCallback) =>
    (dispatch: MiddlewareDispatch) => {
      apiHandler.delete({url: `${BookUrls.Books}/${guid}`}, ({error}) => {
        if (error) {
          errorHandler.newError(error);
          return;
        } else {
          dispatch(deleteStateBook(guid));
          callback(true);
        }
      });
    };

  /* Update Book's detail */
  static update = (data: UpdateBookData, callback: () => void) => {
    apiHandler.put({url: BookUrls.Books, data}, ({response, error}) => {
      if (error) {
        errorHandler.newError(error);
        return;
      }

      if (response?.status === 204) {
        callback();
      }
    });
  };

  /* Get all books' topics */
  static getTopics =
    (callback?: Callback) => (dispatch: MiddlewareDispatch) => {
      apiHandler.get({url: BookUrls.Topics}, ({response, error}) => {
        if (error) {
          callback?.(false);
          errorHandler.newError(error);
          return;
        }

        const data = response?.data;

        if (data != undefined) {
          dispatch(setStateBookTopics(data));
          callback?.(true);
        }
      });
    };

  /* Get book's picks using bookId, offset and limit */
  static getPicks = (params: GetPicksParams, callback: Callback) => {
    apiHandler.get(
      {
        url: BookUrls.Picks,
        config: {params},
      },
      ({response, error}) => {
        if (error) {
          errorHandler.newError(error);
          return;
        }

        const data = response?.data;

        callback(data);
      },
    );
  };

  static updatePick = (data: UpdatePickData, callback: Callback) => {
    const body = formatEditPickBody(data);

    apiHandler.put({url: BookUrls.Picks, data: body}, ({response, error}) => {
      if (error) {
        errorHandler.newError(error);
        return;
      }

      callback(response?.status === 204);
    });
  };

  /* Delete the pick using id and if it's the last one delete the book */
  static deletePick = (params: DeletePickParams, callback: Callback) =>
    apiHandler.delete(
      {url: `books/${params.bookId}/picks/${params.pickId}`},
      ({error, response}) => {
        if (error) {
          errorHandler.newError(error);
          return;
        }

        callback(response?.data);
      },
    );

  /* Perform syntactic and semantic search all over your picks */
  static search = (params: SearchParams, callback: Callback) => {
    apiHandler.get(
      {
        url: BookUrls.Search,
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

  /* Save an extenal book to your library */
  static save =
    (data: SaveBookData, callback: Callback) =>
    (dispatch: MiddlewareDispatch) => {
      apiHandler.post({url: BookUrls.Save, data}, ({response, error}) => {
        if (error) {
          errorHandler.newError(error);
          return;
        }

        const data = response?.data;

        if (data != undefined) {
          dispatch(this.getTopics());
          dispatch(createStateBook(data));

          callback(true);
        }
      });
    };
}

export default BookAPI;
