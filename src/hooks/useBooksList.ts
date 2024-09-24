import BookAPI from '@/api/routes/book';
import FetchLimits from '@/constants/fetchLimits';
import {unionBy} from 'lodash';
import {useRef, useState} from 'react';

const useBooksList = () => {
  const offset = useRef<number>(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [books, setBooks] = useState<any[]>([]);
  const searchText = useRef<string>('');

  const _getBooks = () => {
    setIsLoading(true);

    BookAPI.getList(
      {
        offset: offset.current,
        limit: FetchLimits.BOOKS_LIST,
        type: 'short',
        search: searchText.current,
      },
      ({data, isSuccess}) => {
        if (isSuccess) {
          setIsNotFound(!data || data.length === 0);

          if (offset.current == 0) {
            setBooks(data);
          } else {
            setBooks(unionBy(books, data, 'guid'));
          }

          offset.current += FetchLimits.BOOKS_LIST;

          setIsLoading(false);
        }
      },
    );
  };

  const searchBooks = (text: string) => {
    setBooks([]);
    offset.current = 0;
    searchText.current = text;

    _getBooks();
  };

  return {
    books,
    isLoading,
    isNotFound,

    getMoreBooks: _getBooks,
    searchBooks,
  };
};

export default useBooksList;
