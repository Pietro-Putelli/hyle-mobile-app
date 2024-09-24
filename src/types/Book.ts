import {TextPartProps} from './AddPick';

export type PickExampleProps = {
  content: string;
};

export type PickProps = {
  guid: string;
  title?: string;
  index: number;
  parts: TextPartProps[];
};

type BookPickPreview = {
  guid: string;
  content: string;
};

export type BookProps = {
  guid: string;
  title: string;

  /* JSON content of Pick */
  content: string;
  /* Preview of random pick as plain text */
  preview: BookPickPreview;

  author?: string;
  picksCount: number;
  topics?: BookTopicProps[];
  picks: PickProps[];
  picksOrder: 'asc' | 'desc';
  createdAt: string;
  updatedAt: string;
};

export type BookTopicProps = {
  title: string;
  color: string;
  count: number;
};
