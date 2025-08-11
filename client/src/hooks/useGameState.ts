import { useReducer } from "react";

export type State = 'HIT' | 'PRESENT' | 'MISS' | 'UNKNOWN';
export type Letter = {
  letter: string;
  state: State;
};
export type Word = Letter[];

type GameStateAction =
  | { type: 'initialized_words'; payload: { minRow: number } }
  | { type: 'added_letter'; payload: { letter: string } }
  | { type: 'restored_words'; payload: { words: Word[], dummyRowCount: number } }
  | { type: 'replaced_current_word'; payload: { wordToReplace: Word } }
  | { type: 'added_row' }
  | { type: 'proceeded_row' }
  | { type: 'deleted_letter' };


function useGameState(minRow: number = 6) {

  const generateInitialState = (minRow: number) => ({
    words: Array.from({ length: minRow }, () => []) as Word[],
    currentRowIdx: 0,
  });

  return useReducer(
    (prevState, action: GameStateAction) => {
      switch (action.type) {
        case 'initialized_words': {
          return generateInitialState(action.payload.minRow)
        }

        case 'added_letter': {
          const letter = action.payload.letter;
          const currentRowIdx = prevState.currentRowIdx;
          const words = prevState.words;

          return {
            ...prevState,
            words: [
              ...words.slice(0, currentRowIdx),
              words[currentRowIdx].concat({ letter, state: 'UNKNOWN' }),
              ...words.slice(currentRowIdx + 1),
            ],
          };
        }

        case 'restored_words': {
          const words = action.payload.words;
          const dummyRowCount = action.payload.dummyRowCount;

          return {
            ...prevState,
            words: [
              ...words,
              ...Array.from({ length: dummyRowCount }, () => []),
            ],
            currentRowIdx: words.length
          };
        }

        case 'added_row': {
          return {
            ...prevState,
            words: [...prevState.words, []],
            currentRowIdx: prevState.currentRowIdx + 1
          };
        }

        case 'proceeded_row' : {
          return {
            ...prevState,
            currentRowIdx: prevState.currentRowIdx + 1
          };
        }

        case 'deleted_letter': {
          const currentRowIdx = prevState.currentRowIdx;
          const words = prevState.words;

          return {
            ...prevState,
            words: [
              ...words.slice(0, currentRowIdx),
              words[currentRowIdx].slice(0, -1),
              ...words.slice(currentRowIdx + 1),
            ],
          };
        }

        case 'replaced_current_word': {
          const currentRowIdx = prevState.currentRowIdx;
          const words = prevState.words;
          const wordToReplace = action.payload.wordToReplace;

          return {
            ...prevState,
            words: [
              ...words.slice(0, currentRowIdx),
              [...wordToReplace],
              ...words.slice(currentRowIdx + 1),
            ],
          };
        }

        default: {
          throw new Error('Action type not found.');
        }
      }
    },
    generateInitialState(minRow)
  );
}

export default useGameState;