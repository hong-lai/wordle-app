import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './layouts/Header';
import Keyboard from './components/Keyboard/Keyboard';
import Board from './components/Wordle/Board';
import MessageBar from './components/MessageBar';
import Setting from './components/Setting';
import useTimeoutState from './hooks/useTimoutState';
import useGameState, { type Word } from './hooks/useGameState';
import useGameSetting, { type GameMode } from './hooks/useGameSetting';
import api from './config/api';

export type GameStatus = 'WIN' | 'LOSE' | 'PLAYING' | 'LOADING' | 'WAITING';
export interface InputController {
  backspace(): void;
  letter(key: string): void;
  enter(): void;
}

type LastGame = {
  playerName: string;
  history: { details: Word }[];
  mode: GameMode;
  maxGuessPerPlayer: number;
};

// Word length
const MAX_SIZE = 5;

function App() {
  const [timeoutMessage, setTimeoutMessage] = useTimeoutState('');
  const [gameSetting, dispatchGameSetting] = useGameSetting();
  const [gameState, dispatchGameState] = useGameState(gameSetting.minRow);
  const [gameStatus, setGameStatus] = useState<GameStatus>('LOADING');
  const [shakeRow, setShakeRow] = useState<number>();

  const currentWord = gameState.words[gameState.currentRowIdx];

  useEffect(() => {
    const restoreGame = async () => {
      try {
        const response = await api.get('/last-game');
        const lastGame = response.data;

        // Restore game state if there is at least one history
        if (lastGame?.data?.history?.length) {
          const { history, maxGuessPerPlayer, mode, playerName } =
            lastGame.data as LastGame;

          if (mode === 'CHEAT') {
            dispatchGameSetting({ type: 'set_cheat_mode' });
          } else {
            dispatchGameSetting({
              type: 'set_normal_mode',
              payload: { maxRow: maxGuessPerPlayer },
            });
          }

          dispatchGameSetting({
            type: 'set_player_name',
            payload: { playerName },
          });

          const dummyRowCount =
            mode === 'CHEAT'
              ? Math.max(1, gameSetting.minRow - history.length)
              : maxGuessPerPlayer - history.length;

          dispatchGameState({
            type: 'restored_words',
            payload: {
              words: history.map((entry) => entry.details),
              dummyRowCount,
            },
          });

          setTimeoutMessage(`😄 Welcome back, ${playerName}`);
          setGameStatus('PLAYING');
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    restoreGame();
  }, [
    dispatchGameSetting,
    gameSetting.minRow,
    dispatchGameState,
    setTimeoutMessage,
  ]);

  const initializeGame = useCallback(async () => {
    setGameStatus('PLAYING');
    dispatchGameState({
      type: 'initialized_words',
      payload: { minRow: gameSetting.minRow },
    });

    try {
      await api.post('/create', {
        name: gameSetting.playerName,
        mode: gameSetting.mode,
        maxGuessPerPlayer: gameSetting.maxRow,
      });

      setTimeoutMessage('Enter a 5-letter word, then press Enter.');
    } catch (error) {
      setTimeoutMessage('Error fetching data:' + error, 5000);
    }
  }, [dispatchGameState, gameSetting, setTimeoutMessage]);

  const _inputController: InputController = useMemo(
    () => ({
      backspace() {
        dispatchGameState({ type: 'deleted_letter' });
      },

      letter(key: string) {
        if (currentWord.length === MAX_SIZE) {
          return;
        }

        dispatchGameState({
          type: 'added_letter',
          payload: { letter: key.toUpperCase() },
        });
      },

      async enter() {
        setShakeRow(undefined);

        if (currentWord.length !== MAX_SIZE) {
          setTimeoutMessage('Please enter a 5-letter word.', 5000);
          return;
        }

        if (
          gameSetting.mode === 'CHEAT' ||
          gameState.currentRowIdx < gameSetting.maxRow
        ) {
          // Validate Wordle
          try {
            const response = await api.post('/guess', {
              word: currentWord.map((word) => word.letter).join(''),
            });

            if (response.data.success === false) {
              setTimeoutMessage(response.data.message, 5000);
              setShakeRow(gameState.currentRowIdx);
              return;
            }

            const wordDetails = response.data.message.details as Word;

            setGameStatus('WAITING');

            dispatchGameState({
              type: 'replaced_current_word',
              payload: { wordToReplace: wordDetails },
            });

            // Wait until the animation of LetterBox has finished, not elegant, but it works.
            setTimeoutMessage('🧪 Validating your guess...', 2500).then(
              async () => {
                const hitCount = wordDetails.reduce(
                  (sum, curr) => (curr.status === 'HIT' ? 1 : 0) + sum,
                  0
                );

                if (hitCount === MAX_SIZE) {
                  await api.post('/acknowledge');
                  setTimeoutMessage('🎊 Congrats! You won.');
                  setGameStatus('WIN');
                  return;
                }

                const round = gameState.currentRowIdx + 1;

                if (round >= gameSetting.maxRow) {
                  const response = await api.post('/acknowledge');

                  const correctAnswer = response.data.answer;
                  setTimeoutMessage('The correct answer is ' + correctAnswer);
                  setGameStatus('LOSE');
                  return;
                }

                // Add more row if hits the min row
                if (round >= gameSetting.minRow) {
                  dispatchGameState({ type: 'added_row' });
                } else {
                  dispatchGameState({ type: 'proceeded_row' });
                }

                setGameStatus('PLAYING');

                if (hitCount === 4) {
                  setTimeoutMessage("You're almost there!");
                } else {
                  const presentCount = wordDetails.reduce(
                    (sum, curr) => (curr.status === 'PRESENT' ? 1 : 0) + sum,
                    0
                  );
                  setTimeoutMessage(
                    `🟩 Hit: ${hitCount}, 🟨 Present: ${presentCount}`
                  );
                }
              }
            );
          } catch (error) {
            if (error instanceof Error) {
              setTimeoutMessage(error.message, 5000);
            }
          }
        }
      },
    }),
    [
      currentWord,
      dispatchGameState,
      gameSetting.maxRow,
      gameSetting.minRow,
      gameSetting.mode,
      gameState.currentRowIdx,
      setTimeoutMessage,
    ]
  );

  const inputController = useMemo(
    () =>
      new Proxy(_inputController, {
        get(target, prop: keyof typeof _inputController) {
          if (gameStatus !== 'PLAYING') {
            return () => {};
          }

          return target[prop].bind(target);
        },
      }),
    [_inputController, gameStatus]
  );

  const handleKeyboardClick = useCallback(
    (key: string) => {
      if (key === 'Enter') {
        inputController.enter();
      } else if (key === 'Delete') {
        inputController.backspace();
      } else {
        inputController.letter(key);
      }
    },
    [inputController]
  );

  return (
    <>
      <Header />
      {gameStatus === 'LOADING' && (
        <Setting
          state={gameSetting}
          dispatch={dispatchGameSetting}
          start={initializeGame}
        />
      )}
      {gameStatus !== 'LOADING' && (
        <>
          <MessageBar message={timeoutMessage} />
          <div style={{ position: 'relative' }}>
            {(gameStatus === 'WIN' || gameStatus === 'LOSE') && (
              <button style={buttonStyles} onClick={initializeGame}>
                Play Again!
              </button>
            )}
            <div
              style={{
                opacity:
                  gameStatus === 'WIN' || gameStatus === 'LOSE' ? 0.5 : 1,
              }}
            >
              <Board
                maxSize={MAX_SIZE}
                words={gameState.words}
                keyController={inputController}
                shakeRow={shakeRow}
              />
            </div>
          </div>
          <Keyboard onClick={handleKeyboardClick} />
        </>
      )}
    </>
  );
}

const buttonStyles: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 20,
  padding: '10px 18px',
  backgroundColor: '#471959',
  color: '#cecece',
  fontWeight: 600,
  fontSize: '24px',
  border: '4px solid #783094',
};

export default App;
