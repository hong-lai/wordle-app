import { motion } from 'motion/react';
import { useEffect, useCallback, useState, useImperativeHandle, type Ref, useRef } from 'react';
import type { InputController } from '../../App';
import WordleRow from './WordRow';
import type { Word } from '../../hooks/useGameState';

export interface BoardMethod {
  shake(rowIdx: number): void;
}

function Board({
  words,
  maxSize,
  keyController,
  ref,
}: {
  words: Word[];
  maxSize: number;
  keyController: InputController;
  ref: Ref<BoardMethod>
}) {
  const [shakeRow, setShakeRow] = useState(-1);
  const shakeId = useRef<NodeJS.Timeout>(null)

  useImperativeHandle(
    ref,
    () => {
      return {
        shake(rowIdx: number) {
          if (shakeId.current) {
            return;
          }
          setShakeRow(rowIdx);
          shakeId.current = setTimeout(() => {
            setShakeRow(-1);
            shakeId.current = null;
          }, 500);
        },
      };
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Make user feel like typing in the textbox when pressing backspace
      if (e.key === 'Backspace') {
        keyController.backspace();
        return;
      }

      // Not allow further key proprogation!
      if (e.repeat) return;

      if (e.key === 'Enter') {
        keyController.enter();
        return;
      }

      // Should not bother users to use browser shortcut such as Ctrl + R
      const hasModifierKey = e.metaKey || e.altKey || e.ctrlKey;
      if (hasModifierKey) {
        return;
      }

      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        keyController.letter(e.key);
      }
    },
    [keyController]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        scale: { type: 'spring', visualDuration: 0.4, bounce: 0.3 },
      }}
      style={boardStyles}
    >
      {words.map((_, i) => (
        <div
          key={i}
          data-animation={shakeRow === i ? 'shake' : 'none'}
        >
          <WordleRow key={i} word={words[i]} size={maxSize} />
        </div>
      ))}
    </motion.div>
  );
}

const boardStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  rowGap: '6px',
  margin: '12px 0',
};

export default Board;
