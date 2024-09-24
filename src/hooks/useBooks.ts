import BookAPI from '@/api/routes/book';
import {MiddlewareDispatch} from '@/api/types';
import {BookTopicsProps} from '@/components/BookTopics/types';
import {GlobalEvents} from '@/constants/events';
import FetchLimits from '@/constants/fetchLimits';
import {
  appendStateBookPicks,
  deleteStateBookPick,
  getBookTopics,
  getStateBookById,
  getStateBookPicksById,
  getStateBooks,
  setStateBooks,
  updateStateBook,
  updateStateBookPicksOrder,
  updateStateBookTopics,
} from '@/storage/slices/booksSlice';
import {StateMergeMode} from '@/storage/utility';
import {BookProps, PickProps} from '@/types/Book';
import {reorderPicks} from '@/utils/picks';
import {cloneDeep, isEmpty, omit, size, unionBy} from 'lodash';
import {useEffect, useMemo, useRef, useState} from 'react';
import {EventRegister} from 'react-native-event-listeners';
import {useDispatch, useSelector} from 'react-redux';
import useEventListener from './useEventListener';

const useBooks = ({bookId}: any = {}): any => {
  const dispatch = useDispatch<MiddlewareDispatch>();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [isLoadingFromTopic, setIsLoadingFromTopic] = useState(false);
  const [isReversingPicks, setIsReversingPicks] = useState(false);

  const [isNotFound, setIsNotFound] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const offset = useRef<number>(0);

  const serviceStates = {
    isLoading,
    isLoadingFromTopic,
    isNotFound,
    isReversingPicks,
    setIsLoading,
    setIsNotFound,
    isRefreshing,
    setIsRefreshing,
  };

  /* Get overall topics for all books */
  const getTopics = () => {
    setIsLoadingTopics(true);

    dispatch(
      BookAPI.getTopics(isDone => {
        setIsLoadingTopics(!isDone);
      }),
    );
  };

  if (bookId != undefined) {
    const book: BookProps = useSelector((state: any) =>
      getStateBookById(state, bookId),
    );
    const picks =
      useSelector((state: any) => getStateBookPicksById(state, bookId)) ?? [];

    const initialPicksOrder = book?.picksOrder ?? 'desc';
    const picksOrder = useRef<'asc' | 'desc'>(initialPicksOrder);

    const picksCount = size(picks);
    const latestPicksCount = useRef<number>(picksCount);

    const [isLoadingPicks, setIsLoadingPicks] = useState(false);

    /* The downloaded book and its picks */
    const [cachedBook, setCachedBook] = useState<any | null>(null);

    const isBookCached = book == undefined;

    const cachedBookPicks = useMemo(() => {
      const picks = cachedBook?.picks;

      if (picks) {
        return picks.map((pick: any) => {
          return {
            ...omit(pick, ['content']),
            parts: JSON.parse(pick.content),
          };
        });
      }

      return null;
    }, [cachedBook]);

    const picksLength = size(isBookCached ? cachedBookPicks : picks);

    /* Set the offset value to the intial number of picks of the book, that are max 3 */
    const offset = useRef<number>(picksLength);

    /* The initial number of picks of the book (max=3) */
    const [initialPicksCount, setInitialPicksCount] = useState(picksLength);

    useEffect(() => {
      if (!book) {
        setIsLoading(true);

        /* 
          The book is not in the local store, probably because you're ending here
          through an unirsal link, so download it using its id
        */

        BookAPI.get(bookId, ({data, isSuccess}) => {
          if (isSuccess) {
            setCachedBook(data);
            setIsLoading(false);
          }
        });
      } else {
        setIsLoading(false);
      }

      return () => {
        setCachedBook(null);
      };
    }, []);

    useEffect(() => {
      setInitialPicksCount(picksLength);
    }, [picksLength]);

    /* Manage offset when adding or removing picks */

    useEventListener(
      {identifier: GlobalEvents.CreateBookPick},
      () => {
        offset.current += 1;
      },
      [],
    );

    /* Utility Methods */

    const reversePicks = () => {
      setIsReversingPicks(true);

      offset.current = 0;
      picksOrder.current = picksOrder.current == 'asc' ? 'desc' : 'asc';

      getBookPicks();
    };

    const getBookPicks = (
      {untilPickId}: any = {},
      callback?: (pick: any) => void,
    ) => {
      if (isBookCached) {
        if (picksLength == cachedBook?.picksCount) {
          return;
        }
      } else {
        if (
          picksLength == book.picksCount &&
          book.picksOrder == picksOrder.current
        ) {
          /* If all picks are loaded then skip */
          return;
        }
      }

      setIsLoadingPicks(true);

      const limit = FetchLimits.PICKS;

      BookAPI.getPicks(
        {
          bookId,
          offset: offset.current,
          limit,
          orderBy: picksOrder.current,
          untilPickId,
        },
        data => {
          if (data != undefined) {
            setIsLoadingPicks(false);
            setIsReversingPicks(false);

            if (isBookCached) {
              setCachedBook((book: any) => ({
                ...book,
                picks: unionBy(book.picks, data, 'guid'),
              }));
            } else {
              const mode =
                offset.current == 0
                  ? StateMergeMode.Set
                  : StateMergeMode.Append;

              dispatch(
                appendStateBookPicks({
                  bookId,
                  picks: data,
                  mode,
                  order: picksOrder.current,
                }),
              );
            }

            if (untilPickId) {
              const pickIndex =
                data.findIndex((pick: any) => pick.guid == untilPickId) +
                offset.current;

              offset.current += size(data);

              callback?.(pickIndex);
            } else {
              offset.current += limit;
            }
          }
        },
      );
    };

    const _updateBook = (data: any, callback: () => void) => {
      setIsLoading(true);

      BookAPI.update({bookId, ...data}, () => {
        callback();
      });
    };

    const updateBookMetadata = (data: any, callback: () => void) => {
      _updateBook(data, () => {
        callback();

        dispatch(updateStateBook({bookId, data}));
      });
    };

    const updateBookTopics = (
      topics: BookTopicsProps[],
      callback: () => void,
    ) => {
      _updateBook({topics}, () => {
        callback();

        dispatch(updateStateBookTopics({bookId, topics}));
        getTopics();
      });
    };

    const updatePickOrder = (newPicks: PickProps[], callback: () => void) => {
      const newOrder = reorderPicks(picks, newPicks);

      _updateBook({picks: newOrder}, () => {
        callback();

        dispatch(updateStateBookPicksOrder({bookId, changed: newOrder}));
      });
    };

    const deleteBookPick = (
      pickId: string,
      callback: (isLastPickDeleted: boolean) => void,
    ) => {
      const params = {bookId, pickId};
      BookAPI.deletePick(params, data => {
        if (data) {
          const isLastPickDeleted = data?.is_last;
          callback(isLastPickDeleted);

          if (isLastPickDeleted) {
            EventRegister.emit(GlobalEvents.DeleteBook);
          }

          offset.current -= 1;

          dispatch(deleteStateBookPick(params));
        }
      });
    };

    const response = {
      book,
      isBookCached,
      picks,
    };

    if (cachedBook) {
      response.book = cachedBook;
      response.picks = cachedBookPicks;
    }

    return {
      ...response,

      picksLength,
      picksOrder,

      updateBookMetadata,
      updateBookTopics,
      updatePickOrder,

      reversePicks,
      deleteBookPick,
      getBookPicks,

      initialPicksCount,

      isLoadingPicks,
      ...serviceStates,
    };
  }

  const books = useSelector(getStateBooks);
  const topics = useSelector(getBookTopics);

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const booksCount = size(books);

  const refreshBooks = () => {
    offset.current = 0;
    setIsRefreshing(true);
    setSelectedTopics([]);

    getBooks();
    getTopics();
  };

  const getBooks = ({topics}: any = {}) => {
    setIsLoading(true);

    const params: BookGetParams = {
      offset: offset.current,
      limit: FetchLimits.BOOKS,
      type: 'long',
    };

    if (!isEmpty(topics)) {
      /* Ensure that the topics are in lowercase and separated by commas. */
      params.topics = topics.map((topic: any) => topic.toLowerCase()).join(',');
    }

    BookAPI.getList(params, ({data, isSuccess}) => {
      if (isSuccess) {
        const mergeMode =
          offset.current > 0 ? StateMergeMode.Append : StateMergeMode.Set;

        if (offset.current == 0) {
          setIsNotFound(isEmpty(data));
        }

        dispatch(setStateBooks({data, mode: mergeMode}));
      } else {
        setIsNotFound(true);
      }

      setIsLoadingFromTopic(false);
      setIsRefreshing(false);
      setIsLoading(!isSuccess);
    });
  };

  const getMoreBooks = () => {
    offset.current += FetchLimits.BOOKS;
    getBooks({topics: selectedTopics});
  };

  const handleSelectedTopics = (event: any) => {
    setIsLoadingFromTopic(true);

    const topic = event.topic;

    let newTopics = cloneDeep(selectedTopics);

    /* selectedTopics is an array of strings */

    if (topic == 'all') {
      newTopics = [];
      setSelectedTopics([]);
    } else {
      if (newTopics.includes(topic)) {
        newTopics.splice(newTopics.indexOf(topic), 1);
      } else {
        newTopics.push(topic);
      }

      setSelectedTopics(newTopics);
    }

    offset.current = 0;

    getBooks({topics: newTopics});
  };

  useEffect(() => {
    if (isEmpty(books)) {
      getBooks();
    }

    if (isEmpty(topics)) {
      getTopics();
    }
  }, []);

  useEventListener(
    {identifier: GlobalEvents.DeleteBook},
    () => {
      getTopics();
    },
    [],
  );

  useEffect(() => {
    if (booksCount == 0 && !isLoading) {
      setIsNotFound(true);
    } else {
      setIsNotFound(false);
    }
  }, [booksCount]);

  return {
    books,
    topics,

    selectedTopics,
    setSelectedTopics,

    refreshBooks,
    getMoreBooks,
    handleSelectedTopics,
    isLoadingTopics,
    ...serviceStates,
  };
};

export default useBooks;
