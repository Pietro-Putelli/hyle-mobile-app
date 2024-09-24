type PickProps = {
  content: string; // JSON of pick's parts
  index?: number;
};

type CreatePickData = {
  bookId?: string;
  title?: string;
  author?: string;
  pickIndex?: number;
  parts: any[];
};

type CreatePickDataRequestBody = {
  bookId?: string;
  title?: string;
  pick: any;
};

type BookGetParams = {
  search?: string;

  offset?: number;
  limit?: number;
  /* Topic's title comma separated */
  topics?: string;
  type?: 'short' | 'long';
};

type Callback = (data: any) => void;

type ResponseStatusCallback = (isSuccess: boolean) => void;

type GetPicksParams = {
  offset: number;
  limit: number;
  bookId: string;
  orderBy: 'asc' | 'desc';
  /* Used to get all picks (always in bulk of 9n) until this pick id */
  untilPickId?: string;
};

type DeletePickParams = {
  bookId: string;
  pickId: string;
};

type UpdateBookData = {
  bookId: string;
  title?: string;
  author?: string;
  topics?: any[];
  order?: any[];
};

type UpdatePickData = {
  bookId: string;
  pickId?: string;
  parts?: any[];
  title?: string;
};

type SearchParams = {
  query: string;
  offset: number;
  limit: number;

  /* BookId to search in */
  bookId?: string;
};

type SaveBookData = {
  bookId: string;
};
