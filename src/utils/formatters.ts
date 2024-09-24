import {isUndefined, omitBy} from 'lodash';
import {removeUnusedLines} from './strings';

export const clearPickParts = (parts: any) => {
  if (!parts) return undefined;

  return parts.map((part: any, index: number) => {
    let spacesCount = 0;

    if (index == 0) {
      // remove all spaces at the start and get the count of spaces
      const trimmedContent = part.content.trimStart();
      spacesCount = part.content.length - trimmedContent.length;

      return {
        ...part,
        content: removeUnusedLines(trimmedContent),
        end: part.end - spacesCount,
      };
    }

    return {
      ...part,
      content: removeUnusedLines(part.content),
      start: part.start - spacesCount,
      end: part.end - spacesCount,
    };
  });
};

export const formatCreatePickBody = (data: any): CreatePickDataRequestBody => {
  const cleanedParts = clearPickParts(data.parts);

  return omitBy(
    {
      bookId: data?.bookId,
      title: data?.title,
      author: data?.author,
      pick: {
        content: JSON.stringify(cleanedParts),
        contentText: cleanedParts.map((part: any) => part.content).join(''),
        index: data.pickIndex,
      },
    },
    isUndefined,
  ) as CreatePickDataRequestBody;
};

export const formatEditPickBody = ({bookId, pickId, parts, ...data}: any) => {
  const cleanedParts = clearPickParts(parts);
  const plainText = cleanedParts
    ? cleanedParts.map((part: any) => part.content).join('')
    : undefined;

  return omitBy(
    {
      bookId,
      pickId,
      content: cleanedParts ? JSON.stringify(cleanedParts) : undefined,
      text: plainText,
      newBookId: data?.newBookId,
      ...data,
    },
    isUndefined,
  ) as UpdatePickData;
};
