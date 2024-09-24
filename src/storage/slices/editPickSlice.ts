import {
  PickEditHistoryProps,
  TextPartProps,
  TextSelectionProps,
} from '@/types/AddPick';
import {
  getSelectedPart,
  getSelectedParts,
  sortParts,
} from '@/utils/editPickHandlers';
import {generateUUID} from '@/utils/strings';
import {createSlice} from '@reduxjs/toolkit';
import {cloneDeep, isEqual, last, omit} from 'lodash';

type EditPickStateProps = {
  text: string;
  parts: TextPartProps[];
  selection: TextSelectionProps | undefined;
  voiceLanguage: string;
  history: PickEditHistoryProps[];
};

const initialState: EditPickStateProps = {
  text: '',
  parts: [],
  selection: undefined,

  voiceLanguage: 'en-US',

  history: [{id: 'initial', parts: []}],
};

const editPickSlice = createSlice({
  name: 'editPick',
  initialState,
  reducers: {
    setStateTextContent: (state, action) => {
      state.text = action.payload;
    },

    setStateTextParts: (state, action) => {
      let charactersCount = 0;
      let textContent = '';

      state.parts = action.payload.map((part: TextPartProps) => {
        const start = charactersCount;
        const end = charactersCount + part.content.length;

        textContent += part.content;

        charactersCount += part.content.length;

        return {...part, start, end};
      });

      state.text = textContent;
    },

    updateStateTextParts: (state, action) => {
      const {prev, next: content} = action.payload;

      const delta = content.length - prev.length;

      const selectionStart = state.selection?.start ?? 0;
      const prevStatePosition = selectionStart - delta;

      let selectedPart = getSelectedPart({
        parts: state.parts,
        selection: state.selection,
        delta,
      });

      /* Since is deleting, the value of delta must be less than 0 */

      if (delta < 0) {
        // console.log('before:', state.parts);

        const parts = getSelectedParts({
          parts: state.parts,
          selection: state.selection,
          delta,
        });

        // console.log(
        //   '====>',
        //   parts.map(p => p.content),
        // );

        if (parts.length === 1) {
          let part = parts[0];

          const newPart = state.text.substring(part.start, part.end + delta);

          if (newPart.replace(/\s/g, '') === '') {
            let charCount = 0;

            const index = state.parts.findIndex(p => p.id === part.id);

            const newParts = state.parts
              .filter((p: any) => {
                return p.id !== part.id;
              })
              .map((p: any, i: number) => {
                const start = charCount;

                let content = p.content;

                if (index == i) {
                  if (p.content[0] == ' ' && state.text[part.start] != ' ') {
                    content = p.content.substring(1);
                  }
                }

                const end = charCount + content.length;
                charCount += content.length;

                return {...p, content, start, end};
              });

            state.parts = sortParts(newParts);

            // console.log(
            //   '1:',
            //   newParts.map(p => p.content),
            // );
          } else {
            let parts = cloneDeep(state.parts);

            let charCount = 0;

            const toReplace = prev.substring(
              part.start,
              selectionStart + Math.abs(delta),
            );

            const c = part.content.substring(0, part.content.length);

            parts = parts.map((p: any) => {
              const start = charCount;

              let content = p.content;

              if (p.id == part.id) {
                const partContent = prev.substring(part.start, selectionStart);
                content = c.replace(toReplace, partContent);
              }

              const end = charCount + content.length;
              charCount += content.length;

              return {...p, content, start, end};
            });

            // console.log(
            //   '2:',
            //   parts.map(p => p.content),
            // );

            state.parts = sortParts(parts);
          }
        } else {
          let leftBound = parts[0];
          let rightBound = null;

          if (parts.length > 1) {
            rightBound = last(parts);
          }

          let newParts = state.parts.map((p: any) => {
            const newPart = parts.find(part => part.id === p.id);

            if (newPart) {
              return newPart;
            }

            return p;
          });

          let charCount = 0;

          newParts = newParts
            .map((p: any) => {
              const start = charCount;

              let content = p.content;

              if (leftBound && p.id == leftBound.id) {
                content = content.substring(
                  0,
                  p.content.length - p.selectionCount,
                );
              }

              if (rightBound && p.id == rightBound.id) {
                content = content.substring(p.selectionCount, p.content.length);
              }

              if (p.selectionCount == 0) {
                return null;
              }

              const end = charCount + content.length;
              charCount += content.length;

              return {
                ...omit(p, ['selectionCount']),
                content,
                start,
                end,
              };
            })
            .filter((p: any) => p != null);

          const plainText = newParts
            .map((part: TextPartProps) => part.content)
            .join('');

          let trailingSpaceRemoved = false;
          charCount = 0;

          newParts = newParts.map((part: any) => {
            const start = charCount;

            let content = part.content;

            if (part.start >= selectionStart && !trailingSpaceRemoved) {
              const p1 = plainText[selectionStart];
              const p2 = state.text[selectionStart];

              if (p1 == ' ' && p2 != ' ') {
                content = part.content.substring(1);
                trailingSpaceRemoved = true;
              }
            }

            const end = charCount + content.length;
            charCount += content.length;

            return {...part, content, start, end};
          });

          // console.log(
          //   '3:',
          //   newParts.map(p => p.content),
          // );

          state.parts = sortParts(newParts);
        }

        return;
      }

      if (!selectedPart) {
        /* Create the first part */
        if (state.parts.length > 0 && state.selection?.start == 0) {
          selectedPart = state.parts[0];
        } else {
          state.parts = [
            {
              id: generateUUID(),
              content: content,
              type: 'text',
              start: 0,
              end: content.length,
            },
          ];

          return;
        }
      }

      if (!selectedPart) {
        return;
      }

      const partContent = content.substring(
        selectedPart.start,
        (selectedPart.end ?? 0) + delta,
      );

      const findIndex = state.parts.findIndex(
        item => item.id === selectedPart?.id,
      );

      if (partContent.length != 0) {
        state.parts = sortParts(
          state.parts.map((part, index) => {
            if (index == findIndex) {
              return {
                ...part,
                content: partContent,
                end: (part.end ?? 0) + delta,
              };
            }

            if (index > findIndex) {
              return {
                ...part,
                start: (part.start ?? 0) + delta,
                end: (part.end ?? 0) + delta,
              };
            }

            return part;
          }),
        );
      } else {
        const parts = cloneDeep(state.parts);
        parts.splice(findIndex, 1);

        state.parts = sortParts(
          parts.map((part, index) => {
            if (index >= findIndex) {
              return {
                ...part,
                start: (part.start ?? 0) + delta,
                end: (part.end ?? 0) + delta,
              };
            }

            return part;
          }),
        );
      }
    },

    removeStateKeyword: state => {
      const selectedPart = getSelectedPart({
        parts: state.parts,
        selection: state.selection,
        delta: 0,
      });

      if (selectedPart != null) {
        const parts = cloneDeep(state.parts);

        const findIndex = parts.findIndex(item => item.id === selectedPart.id);

        if (findIndex != -1) {
          parts[findIndex].type = 'text';
          state.parts = sortParts(parts);
        }
      }
    },

    removeStateEmptyAnnotations: state => {
      const parts = cloneDeep(state.parts);

      const newParts = parts.map((part: any) => {
        const partAnnotation = part?.annotation ?? '';

        if (part.type == 'annotation' && partAnnotation.length == 0) {
          return {...part, type: 'text'};
        }

        const partTranslation = part?.translation ?? '';

        if (part.type == 'translation' && partTranslation.length == 0) {
          return {...part, type: 'text'};
        }

        return part;
      });

      state.parts = sortParts(newParts);
    },

    addStateKeyword: (state, action) => {
      const {content, type} = action.payload;

      const part = getSelectedPart({
        parts: state.parts,
        selection: state.selection,
        delta: 0,
      });

      const pStart = part?.start ?? 0;
      const pEnd = part?.end ?? 0;

      const selectionStart = state.selection!.start;
      const selectionEnd = state.selection!.end;

      if (part == null) {
        return;
      }

      /* The part coincide with the keyword */
      if (pStart == selectionStart && pEnd == selectionEnd) {
        const parts = cloneDeep(state.parts);

        const findIndex = parts.findIndex(item => item.id === part?.id);

        const part = {
          ...parts[findIndex],
          type,
        };

        if (part.end != undefined) {
          // state.selection = {
          //   start: part.end,
          //   end: part.end,
          // };
        }
      } else if (selectionStart >= pStart && selectionEnd <= pEnd) {
        /* The keyword is inside the part selected */

        const beforeKeyword: TextPartProps = {
          id: generateUUID(),
          content: content.substring(pStart, selectionStart),
          type: 'text',
          start: pStart,
          end: selectionStart,
        };

        const keyword: TextPartProps = {
          id: generateUUID(),
          content: content.substring(selectionStart, selectionEnd),
          type: type,
          start: selectionStart,
          end: selectionEnd,
        };

        const afterKeyword: TextPartProps = {
          id: generateUUID(),
          content: content.substring(selectionEnd, pEnd),
          type: 'text',
          start: selectionEnd,
          end: pEnd,
        };

        const findIndex = state.parts.findIndex(item => item.id === part?.id);

        if (findIndex !== -1) {
          const parts = cloneDeep(state.parts);

          parts[findIndex] = beforeKeyword;
          parts.splice(findIndex + 1, 0, keyword);
          parts.splice(findIndex + 2, 0, afterKeyword);

          if (keyword.end != undefined) {
            state.selection = {
              start: keyword.end,
              end: keyword.end,
            };
          }

          state.parts = sortParts(parts);
        }
      }
    },

    updateStateAnnotationForKeyword: (state, action) => {
      const {id, content, sources} = action.payload;

      const findIndex = state.parts.findIndex(item => item.id === id);

      const trimmedContent = content.trim();

      if (findIndex !== -1 && trimmedContent.length > 0) {
        state.parts[findIndex].annotation = content;
        state.parts[findIndex].sources = sources;
      }
    },

    updateStateAnnotationForTranslation: (state, action) => {
      const {id, translation, definition, language, dictionaryUrl} =
        action.payload;

      const findIndex = state.parts.findIndex(item => item.id === id);

      if (findIndex !== -1) {
        state.parts[findIndex].translation = translation;
        state.parts[findIndex].definition = definition;
        state.parts[findIndex].language = language;
        state.parts[findIndex].dictionaryUrl = dictionaryUrl;
      }
    },

    setStateTextSelection: (state, action) => {
      state.selection = action.payload;
    },

    updateStateHistory: state => {
      const lastHistory = {
        id: generateUUID(),
        parts: cloneDeep(state.parts),
      };

      const historyParts = state.history[state.history.length - 1].parts;
      const currentParts = state.parts;

      const historyAnnotations = historyParts.map(part => part.annotation);
      const currentAnnotations = currentParts.map(part => part.annotation);

      if (
        historyAnnotations.length == currentAnnotations.length &&
        !isEqual(historyAnnotations, currentAnnotations)
      ) {
        const changedIndex = currentAnnotations.findIndex(
          (annotation, index) => {
            return annotation !== historyAnnotations[index];
          },
        );

        if (changedIndex !== -1) {
          const changedPart = currentParts[changedIndex];

          state.history[state.history.length - 1].parts[
            changedIndex
          ].annotation = changedPart.annotation;
        }

        return;
      }

      state.history.push(lastHistory);
    },

    setStateHistory: (state, action) => {
      const {parts} = action.payload;

      const lastHistory = {
        id: generateUUID(),
        parts: cloneDeep(parts),
      };

      state.history = [lastHistory];
    },

    setStateVoiceLanguage: (state, action) => {
      state.voiceLanguage = action.payload;
    },

    flushStateEditPickState: state => {
      state.text = initialState.text;
      state.parts = initialState.parts;
      state.selection = initialState.selection;
      state.history = initialState.history;
      state.voiceLanguage = initialState.voiceLanguage;
    },
  },
});

export const {
  setStateTextContent,
  setStateTextParts,
  updateStateTextParts,
  setStateTextSelection,

  updateStateAnnotationForKeyword,
  updateStateAnnotationForTranslation,

  removeStateKeyword,
  removeStateEmptyAnnotations,
  addStateKeyword,
  setStateHistory,

  updateStateHistory,
  setStateVoiceLanguage,

  flushStateEditPickState,
} = editPickSlice.actions;

export const getEditPickState = (state: any) => {
  return state.editPickSlice;
};

export const getVoiceLanguageState = (state: any): string => {
  return state.editPickSlice.voiceLanguage;
};

export const getPartById = (state: any, id?: string): TextPartProps | null => {
  if (!id) {
    return null;
  }

  return state.editPickSlice.parts.find(
    (part: TextPartProps) => part.id === id,
  );
};

export default editPickSlice.reducer;
