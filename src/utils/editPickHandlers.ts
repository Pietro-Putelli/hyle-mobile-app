import {TextPartProps, TextSelectionProps} from '@/types/AddPick';
import {generateUUID} from './strings';
import {find, findIndex, pick, uniqBy} from 'lodash';

type GetSelectedPartParams = {
  parts: TextPartProps[];
  selection: TextSelectionProps | undefined;
  delta: number;
};

export const getSelectedPart = ({
  parts,
  selection,
  delta = 0,
}: GetSelectedPartParams) => {
  if (!selection) {
    return undefined;
  }

  const {start, end} = selection;

  let response = null;

  for (let index = 0; index < parts.length; index++) {
    const part = parts[index];

    const pStart = part.start ?? 0;
    const pEnd = part.end ?? 0;

    if (delta == 0) {
      if (start >= pStart && end <= pEnd) {
        response = part;
        break;
      }
    } else if (delta > 0) {
      delta = Math.abs(delta);
      const originalStart = start - delta;

      if (originalStart >= pStart && end <= pEnd + delta) {
        response = part;
        break;
      }
    } else {
      const originalEnd = end + Math.abs(delta);

      if (start >= pStart && originalEnd < pEnd - delta) {
        response = part;
        break;
      }
    }
  }

  return response;
};

export const getPartFrom = ({start, parts}: any) => {
  for (let index = 0; index < parts.length; index++) {
    const part = parts[index];

    if (part.end + 1 >= start) {
      return part;
    }
  }

  return null;
};

export const sortParts = (parts: TextPartProps[]) => {
  let textParts = '';
  let start = null;
  let charCount = 0;

  const newParts = [];

  for (let index = 0; index < parts.length + 1; index++) {
    const part = parts[index];

    if (part == undefined) {
      if (textParts != '' && start != null) {
        newParts.push({
          id: generateUUID(),
          content: textParts,
          type: 'text',
          start,
          end: start + textParts.length,
        });
      }

      break;
    }

    if (part.type == 'text') {
      if (textParts == '') {
        start = part.start;
      }

      textParts += part.content;
    } else {
      if (textParts != '' && start != null) {
        newParts.push({
          id: generateUUID(),
          content: textParts,
          type: 'text',
          start,
          end: start + textParts.length,
        });

        textParts = '';
        start = null;
      }

      newParts.push({
        ...part,
        start: charCount,
        end: charCount + part.content.length,
      });
    }

    charCount += part.content.length;
  }

  return newParts;
};

export const getSelectedParts = ({parts, selection, delta = 0}: any) => {
  const start = selection.start;
  const end = selection.end + Math.abs(delta);

  const filteredParts: any[] = [];

  const singlePartSelected = find(parts, (part: any) => {
    return part.start == start + 1 && part.end == end;
  });

  if (singlePartSelected != undefined) {
    return [singlePartSelected];
  }

  for (let part of parts) {
    const {start: pStart, end: pEnd} = part;

    let selectionCount = 0;

    if (start > pStart && start < pEnd) {
      selectionCount = pEnd - start;
    }

    if (end > pStart && end < pEnd) {
      // console.log('2:', part.content, pEnd, end);

      selectionCount = end - pStart;
    }

    if ((start > pStart && start < pEnd) || (pStart >= start && pEnd <= end)) {
      // console.log('1:', part.content);
      filteredParts.push({...part, selectionCount});
      // continue;
    }

    if (pEnd == end - 1) {
      break;
    }

    if (end > pStart && end < pEnd) {
      // console.log('2:', part.content);
      filteredParts.push({...part, selectionCount});
    }
  }

  return uniqBy(filteredParts, 'id');
};

export const isSelectionCrossingKeyword = ({
  parts,
  selection,
}: any): boolean => {
  const selectedPart = getSelectedParts({parts, selection});

  return selectedPart.some(part => part.type === 'keyword');
};
