import {TextPartProps} from '@/types/AddPick';
import {BookProps, BookTopicProps} from '@/types/Book';
import {createSelector, createSlice} from '@reduxjs/toolkit';
import {findIndex, omit, unionBy, pick, cloneDeep, union, clone} from 'lodash';
import {StateMergeMode} from '../utility';
import moment from 'moment';

type BookStateProps = {
  books: BookProps[];
  topics: BookTopicProps[];
};

const initialState: BookStateProps = {
  books: [],
  topics: [],
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setStateBooks: (state, action) => {
      const {data, mode} = action.payload;

      if (!data) {
        state.books = [];
        return;
      }

      const formattedData = data.map((book: BookProps) => {
        return {
          ...book,
          picks: book.picks.map((pick: any) => {
            return {
              ...omit(pick, ['content']),
              parts: JSON.parse(pick.content),
            };
          }),
        };
      });

      if (mode == StateMergeMode.Set) {
        state.books = formattedData;
      } else {
        state.books = unionBy(state.books, formattedData, 'guid');
      }
    },

    setStateBookTopics: (state, action) => {
      /* Check if the first item "all" has count = 0 */
      const firstItem = action.payload[0];

      if (firstItem != undefined && firstItem.count == 0) {
        state.topics = [];
      } else {
        state.topics = action.payload;
      }
    },

    setStateBookPicks: (state, action) => {
      const {bookId, picks} = action.payload;

      const book = state.books.find((book: BookProps) => book.guid === bookId);

      if (book != undefined) {
        const formattedPicks = picks.map((pick: any) => {
          return {
            ...omit(pick, ['content']),
            parts: JSON.parse(pick.content),
          };
        });

        book.picks = formattedPicks;
      }
    },

    updateStateBookTopics: (state, action) => {
      const {bookId, topics} = action.payload;

      const book = state.books.find((book: BookProps) => book.guid === bookId);

      if (book) {
        book.topics = topics;
      }

      /* Update the topic's color for each book that contains one of the edited topic */
      state.books = state.books.map((book: BookProps) => {
        if (book.topics) {
          book.topics = book.topics.map((topic: any) => {
            const editedTopic = topics.find(
              (t: any) => t.topic === topic.topic && t.color !== topic.color,
            );

            if (editedTopic) {
              return {
                ...topic,
                color: editedTopic.color,
              };
            }

            return topic;
          });
        }

        return book;
      });
    },

    updateStateBookPicksOrder: (state, action) => {
      const {bookId, changed} = action.payload;

      let book = state.books.find((book: BookProps) => book.guid === bookId);
      let picks = cloneDeep(book?.picks);

      if (book != undefined && picks != undefined) {
        for (let i = 0; i < picks.length; i++) {
          for (let j = 0; j < changed.length; j++) {
            if (picks[i].guid === changed[j].guid) {
              picks[i].index = changed[j].index;
            }
          }
        }

        picks = picks.sort((a: any, b: any) => b.index - a.index);
        book.picks = picks;
      }
    },

    updateStateBook: (state, action) => {
      const {bookId, data} = action.payload;

      const book = state.books.find((book: BookProps) => book.guid === bookId);

      if (book) {
        Object.assign(book, data);
      }
    },

    /* Use to update single pick */
    updateStateBookPick: (state, action) => {
      const {bookId, pickId, parts, title} = action.payload;

      const book = state.books.find((book: BookProps) => book.guid === bookId);

      if (book != undefined) {
        const pick = book.picks.find((pick: any) => pick.guid === pickId);

        if (pick != undefined) {
          if (parts) {
            pick.parts = parts;
          }

          if (title) {
            pick.title = title;
          }
        }

        if (parts && book.preview.guid === pickId) {
          book.preview.content = parts
            .map((part: any) => part.content)
            .join('');
        }

        book.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        state.books = unionBy([book], state.books, 'guid');
      }
    },

    /* Use to append a pick after being created */
    appendStateBookPick: (state, action) => {
      const {bookId, pick} = action.payload;

      const book = state.books.find((book: BookProps) => book.guid === bookId);

      if (book != undefined) {
        if (book.picks == undefined) {
          book.picks = [];
        }

        book.updatedAt = pick.updatedAt;

        const newPick: any = {
          ...omit(pick, ['content', 'updatedAt']),
          parts: JSON.parse(pick.content),
        };

        let picks = cloneDeep(book.picks);
        const bookPicksLength = book.picks.length;

        if (bookPicksLength == newPick.index) {
          /* If the pick is the last one (order by last inserted), then just push it */
          picks.unshift(newPick);
        } else {
          for (let i = 0; i < bookPicksLength; i++) {
            const currIndex = book.picks[i].index;

            if (currIndex == newPick.index - 1) {
              picks.splice(i, 0, newPick);
            }
          }

          picks = picks.map((pick: any, index: number) => {
            return {
              ...pick,
              index: book.picksCount - index,
            };
          });
        }

        book.picks = picks;
        book.picksCount++;

        // move the book to the top of the list
        state.books = unionBy([book], state.books, 'guid');
      }
    },

    /* 
      Use to concatenate a list of more picks when getting more.
      This picks come from the API, so you need to format them.
    */
    appendStateBookPicks: (state, action) => {
      const {bookId, picks, mode, order} = action.payload;

      const book = state.books.find((book: BookProps) => book.guid === bookId);

      if (book != undefined) {
        const formattedPicks = picks.map((pick: any) => {
          return {
            ...omit(pick, ['content']),
            parts: JSON.parse(pick.content),
          };
        });

        if (order != undefined) {
          book.picksOrder = order;
        }

        if (mode == StateMergeMode.Set) {
          book.picks = formattedPicks;
        } else {
          book.picks = unionBy(book.picks, formattedPicks, 'guid');
        }
      }
    },

    updateStateBookPickAnnotation: (state, action) => {
      const {annotation, content} = action.payload;
      const {bookId, pickId, content: selectedAnnotation} = annotation;

      const bookIndex = findIndex(state.books, (book: BookProps) => {
        return book.guid === bookId;
      });

      if (bookIndex != -1) {
        const pickIndex = findIndex(
          state.books[bookIndex].picks,
          (pick: any) => pick.guid === pickId,
        );

        if (pickIndex != -1) {
          const annotationIndex = findIndex(
            state.books[bookIndex]?.picks?.[pickIndex].parts,
            (part: TextPartProps) => {
              return part.content === selectedAnnotation;
            },
          );

          if (annotationIndex != -1) {
            const annotation =
              state.books[bookIndex].picks?.[pickIndex].parts[annotationIndex];

            if (annotation != undefined) {
              annotation.annotation = content;
            }
          }
        }
      }
    },

    deleteStateBook: (state, action) => {
      const bookId = action.payload;

      state.books = state.books.filter(
        (book: BookProps) => book.guid !== bookId,
      );
    },

    deleteStateBookPick: (state, action) => {
      const {bookId, pickId} = action.payload;

      const book = state.books.find((book: BookProps) => book.guid === bookId);

      if (book != undefined) {
        if (book.picks.length > 1) {
          const pickToDelete = book.picks.find(
            (pick: any) => pick.guid === pickId,
          );

          if (pickToDelete != undefined) {
            book.picks = book.picks.filter(
              (pick: any) => pick.guid !== pickToDelete.guid,
            );
            book.picksCount--;

            book.picks.map((pick: any) => {
              if (pick.index > pickToDelete.index) {
                pick.index--;
              }
              return pick;
            });
          }
        } else {
          state.books = state.books.filter(
            (book: BookProps) => book.guid !== bookId,
          );
        }
      }
    },

    /* Create or save a book */
    createStateBook: (state, action) => {
      const newBook = action.payload;

      newBook.picks = newBook.picks.map((pick: any) => {
        return {
          ...omit(pick, ['content']),
          parts: JSON.parse(pick.content),
        };
      });

      state.books = unionBy([newBook], state.books, 'guid');
    },

    flushBookState: state => {
      state.books = [];
      state.topics = [];
    },
  },
});

export const {
  setStateBooks,
  setStateBookTopics,
  setStateBookPicks,

  updateStateBookTopics,
  updateStateBookPicksOrder,
  updateStateBook,
  updateStateBookPick,
  updateStateBookPickAnnotation,
  deleteStateBook,
  deleteStateBookPick,
  createStateBook,

  appendStateBookPick,
  appendStateBookPicks,

  flushBookState,
} = booksSlice.actions;

export const getStateBooks = (state: any) => state.booksSlice.books;

export const getStateBookById = createSelector(
  [getStateBooks, (_: any, bookId?: string) => bookId],
  (books, bookId) => {
    if (!bookId) return null;

    return books.find((book: BookProps) => book.guid === bookId);
  },
);

export const getStateBookPicksById = createSelector(
  [getStateBooks, (_: any, bookId: string) => bookId],
  (books, bookId) => {
    const book = books.find((book: BookProps) => book.guid === bookId);

    return book?.picks ?? [];
  },
);

export const getStateBookPickById = createSelector(
  [
    getStateBooks,
    (_: any, bookId: string) => bookId,
    (_: any, __: any, pickId: string) => pickId,
  ],
  (books, bookId, pickId) => {
    const book = books.find((book: BookProps) => book.guid === bookId);

    return book?.picks.find((pick: any) => pick.guid === pickId);
  },
);

export const getPickAnnotations = createSelector(
  [
    getStateBooks,
    (_: any, bookId: string) => bookId,
    (_: any, __: any, pickId: string) => pickId,
  ],
  (books, bookId, pickId) => {
    const book = books.find((book: BookProps) => book.guid === bookId);

    if (book != undefined && book.picks != undefined) {
      const pick = book.picks.find((pick: any) => pick.guid === pickId);

      return pick.parts.filter((part: TextPartProps) => {
        return (
          part.type != 'text' &&
          part.type != 'translation' &&
          part.annotation &&
          part.annotation.length > 0
        );
      });
    }

    return [];
  },
);

export const getBookTopics = (state: any) => state.booksSlice.topics;

export default booksSlice.reducer;
