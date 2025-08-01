import { useCallback, useState } from 'react';
import Keyboard from './components/Keyboard/Keyboard';
import WordleBoard from './components/Wordle/WordleBoard';
import { type GameMode } from '@wordle/WordleGame';
import useTimeoutMessage from './hooks/useTimoutMessage';
import StatusBar from './components/StatusBar';
import axios from 'axios';
import GameSetting from './components/Wordle/WordleSetting';

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  import.meta.env.VITE_API_URI ?? 'http://localhost:5555/api/v1';

export type Status = 'HIT' | 'PRESENT' | 'MISS' | 'UNKNOWN';
export type Letter = {
  letter: string;
  status: Status;
};
export type Word = Letter[];
export type GameState = 'WIN' | 'LOSE' | 'PLAYING' | 'WAITING';
export interface InputController {
  backspace(): void;
  letter(key: string): void;
  enter(): void;
}

// word length
const MAX_SIZE = 5;

function App() {
  const [currentRowIdx, setCurrentRowIdx] = useState(0);
  const [gameState, setGameState] = useState<GameState>('WAITING');
  const [timeoutMessage, setTimeoutMessage] = useTimeoutMessage();
  const [maxRow, setMaxRow] = useState(6);
  const [minRow, setMinRow] = useState(6);
  const [mode, setMode] = useState<GameMode>('NORMAL');
  const [playerName, setPlayerName] = useState('Player from HK');
  const [words, setWords] = useState<Word[]>(() =>
    Array.from({ length: 6 }, () => [])
  );

  const initializeGame = async () => {
    const _minRow = Math.min(maxRow, 6);
    setMinRow(_minRow);
    setPlayerName('Player');
    setGameState('PLAYING');
    setWords(() => Array.from({ length: _minRow }, () => []));
    setCurrentRowIdx(0);

    try {
      await axios.post('/create', {
        name: playerName,
        mode: mode,
        maxGuessPerPlayer: maxRow,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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

    async enter() {
      if (gameState !== 'PLAYING') {
        return;
      }

      if (words[currentRowIdx].length !== MAX_SIZE) {
        return;
      }

      if (mode === 'CHEAT' || currentRowIdx < maxRow) {
        // ----------------------------------------------------------
        // Validate Wordle
        // ----------------------------------------------------------
        try {
          const response = await axios.post('/guess', {
            word: words[currentRowIdx].map((word) => word.letter).join(''),
          });

          if (response.data.success === false) {
            setTimeoutMessage(response.data.message);
            return;
          }

          const resultDetails = response.data.message.details as Letter[];

          // apply all statuses to words
          words[currentRowIdx].forEach((letter, i) => {
            letter.status = resultDetails[i].status;
          });

          setWords([
            ...words.slice(0, currentRowIdx),
            [
              ...words[currentRowIdx].map((w, i) => ({
                letter: w.letter,
                status: resultDetails[i].status,
              })),
            ],
            ...words.slice(currentRowIdx + 1),
          ]);

          const hitCount = resultDetails.reduce((sum, curr) => {
            return (curr.status === 'HIT' ? 1 : 0) + sum;
          }, 0);

          if (hitCount === MAX_SIZE) {
            setGameState('WIN');
            return;
          }

          const round = currentRowIdx + 1;

          if (mode === 'NORMAL' && round >= maxRow) {
            const response = await axios.post('/acknowledge');

            const correctAnswer = response.data.answer;

            setTimeoutMessage('The correct answer is ' + correctAnswer, 5000);
            setGameState('LOSE');
            return;
          }

          // add more row if hits the min row
          if (round >= minRow) {
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

  const ResetButton = <button onClick={initializeGame}>Play Again!</button>;

  return (
    <>
      <div
        style={{
          position: 'sticky',
          backgroundColor: '#242424',
          top: 0,
        }}
      >
        <h2>WORDLE APP 👾</h2>
        {gameState !== 'WAITING' && (
          <StatusBar
            gameState={gameState}
            resetComponent={ResetButton}
            message={timeoutMessage}
          />
        )}
      </div>
      {gameState === 'WAITING' && (
        <GameSetting
          setMaxRow={setMaxRow}
          setMode={setMode}
          maxRow={maxRow}
          mode={mode}
          start={initializeGame}
        />
      )}
      {gameState !== 'WAITING' && (
        <>
          <WordleBoard
            maxSize={MAX_SIZE}
            words={words}
            keyController={inputController}
          />
          <Keyboard onClick={handleKeyboardClick} />
        </>
      )}
    </>
  );
}

export default App;
