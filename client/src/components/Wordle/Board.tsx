import { motion } from 'motion/react';
import { useEffect, useCallback, useState } from 'react';
import type { InputController } from '../../App';
import WordleRow from './WordRow';
import type { Word } from '../../hooks/useGameState';

function Board({
  words,
  maxSize,
  keyController,
  shakeRow
}: {
  words: Word[];
  maxSize: number;
  keyController: InputController;
  shakeRow?: number
}) {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (shakeRow) {
      setShake(true);
    }
  }, [shakeRow])

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
          data-animation={(shake && i === shakeRow) ? 'shake' : 'none'}
          onAnimationEnd={() => (setShake(false))}
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
