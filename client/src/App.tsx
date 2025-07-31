import { useState } from 'react';
import Keyboard from './components/Keyboard/Keyboard';
import WordleBoard from './components/Wordle/WordleBoard';
import WordleGame from '@wordle/WordleGame';
import useTimeoutMessage from './hooks/useTimoutMessage';
import StatusBar from './components/StatusBar';

const MAX_SIZE = 5;
const MIN_ROW = 6;
const MAX_ROW = 6;

const initializeWords = () => Array.from({ length: MIN_ROW }, () => []);
const initializeGame = () => new WordleGame({ maxGuessPerPlayer: MAX_ROW });

export type Status = 'HIT' | 'PRESENT' | 'MISS' | 'UNKNOWN';
export type Letter = {
  letter: string;
  status: Status;
};
export type Word = Letter[];
export type GameState = 'WIN' | 'LOSE' | 'PLAYING';
export interface InputController {
  backspace(): void;
  letter(key: string): void;
  enter(): void;
}

function App() {
  // keep track of which row is active
  const [currentRowIdx, setCurrentRowIdx] = useState(0);
  const [words, setWords] = useState<Word[]>(initializeWords);
  const [wordleGame, setWordleGame] = useState(initializeGame);
  const [gameState, setGameState] = useState<GameState>('PLAYING');
  const [timeoutMessage, setTimeoutMessage] = useTimeoutMessage();

  const inputController: InputController = {
    backspace() {
      if (gameState !== 'PLAYING') {
        return;
      }

      setWords([
        ...words.slice(0, currentRowIdx),
        words[currentRowIdx].slice(0, -1),
        ...words.slice(currentRowIdx + 1),
      ]);
    },

    letter(key: string) {
      if (gameState !== 'PLAYING') {
        return;
      }

      if (words[currentRowIdx].length === MAX_SIZE) {
        return;
      }

      setWords([
        ...words.slice(0, currentRowIdx),

        words[currentRowIdx].concat({
          letter: key.toUpperCase(),
          status: 'UNKNOWN',
        }),

        ...words.slice(currentRowIdx + 1),
      ]);
    },

    enter() {
      if (gameState !== 'PLAYING') {
        return;
      }

      if (words[currentRowIdx].length !== MAX_SIZE) {
        return;
      }

      if (currentRowIdx < MAX_ROW) {
        // ----------------------------------------------------------
        // Validate Wordle
        // ----------------------------------------------------------
        try {
          const result = wordleGame.guess(
            words[currentRowIdx].map((word) => word.letter).join('')
          );

          // apply all statuses to words
          words[currentRowIdx].forEach((letter, i) => {
            letter.status = result.details[i].status;
          });

          setWords([
            ...words.slice(0, currentRowIdx),
            [
              ...words[currentRowIdx].map((w, i) => ({
                letter: w.letter,
                status: result.details[i].status,
              })),
            ],
            ...words.slice(currentRowIdx + 1),
          ]);

          // win the game if all HITs happen
          if (result.statistic.get('HIT') === MAX_SIZE) {
            setGameState('WIN');
            return;
          }

          const round = currentRowIdx + 1;

          // lost the game if it is the max round without all HITs
          if (round >= MAX_ROW) {
            setTimeoutMessage("The correct answer is " + wordleGame.getWordleAnswer(), 5000);
            setGameState('LOSE');
            return;
          }

          // add more row if hits the min row
          if (round >= MIN_ROW) {
            setWords([...words, []]);
          }

          setCurrentRowIdx(currentRowIdx + 1);
        } catch (error) {
          if (error instanceof Error) {
            setTimeoutMessage(error.message);
          }
        }
      }
    },
  };

  const handleKeyboardClick = (key: string) => {
    if (key === 'Enter') {
      inputController.enter();
    } else if (key === 'Delete') {
      inputController.backspace();
    } else {
      inputController.letter(key);
    }
  };

  const ResetButton = (
    <button
      onClick={() => {
        setWords(initializeWords);
        setCurrentRowIdx(0);
        setGameState('PLAYING');
        setWordleGame(initializeGame);
      }}
    >
      Play Again!
    </button>
  );

  return (
    <>
      <h2>WORDLE APP 👾</h2>
      <StatusBar
        gameState={gameState}
        resetComponent={ResetButton}
        message={timeoutMessage}
      />
      <WordleBoard
        maxSize={MAX_SIZE}
        maxRow={MAX_ROW}
        words={words}
        currentRowIdx={currentRowIdx}
        keyController={inputController}
      />
      <Keyboard onClick={handleKeyboardClick} />
    </>
  );
}

export default App;
