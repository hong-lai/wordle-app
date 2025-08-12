import { useReducer } from "react";
import { letterColor } from "../components/Wordle/color";

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


const KeyHighlightMapReducer = (prev: Record<string, string>, letter: Letter) => {
  let color = letterColor.MISS;

  if (prev[letter.letter] === letterColor.HIT || letter.state === 'HIT') {
    color = letterColor.HIT;
  }

  else if (prev[letter.letter] === letterColor.PRESENT || letter.state === 'PRESENT') {
    color = letterColor.PRESENT;
  }

  return {
    ...prev,
    [letter.letter]: color
  };
}

function useGameState(minRow: number = 6) {

  const generateInitialState = (minRow: number) => ({
    words: Array.from({ length: minRow }, () => []) as Word[],
    currentRowIdx: 0,
    keyHightlightMap: {} as Record<string, string>
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
            currentRowIdx: words.length,
            keyHightlightMap: words.flat().reduce(KeyHighlightMapReducer, {})
          };
        }

        case 'added_row': {
          return {
            ...prevState,
            words: [...prevState.words, []],
            currentRowIdx: prevState.currentRowIdx + 1
          };
        }

        case 'proceeded_row': {
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
            keyHightlightMap: wordToReplace.reduce(KeyHighlightMapReducer, prevState.keyHightlightMap)
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