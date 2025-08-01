import { motion } from 'motion/react';
import { useEffect, useCallback } from 'react';
import type { InputController, Word } from '../../App';
import WordleRow from './WordleWordRow';

function WordleBoard({
  words,
  maxSize,
  keyController
}: {
  words: Word[];
  maxSize: number;
  keyController: InputController 
}) {
  const boardStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '6px',
    margin: '12px 0',
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // make user feel like typing in the textbox when pressing backspace
      if (e.key === 'Backspace') {
        keyController.backspace();
        return;
      }

      // not allow further key proprogation!
      if (e.repeat) return;

      // should not bother users to use browser shortcut such as Ctrl + R
      const hasModifierKey = e.metaKey || e.altKey || e.ctrlKey;
      if (hasModifierKey) {
        return;
      }

      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        keyController.letter(e.key);
      }

      if (e.key === 'Enter') {
        keyController.enter();
        return;
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
        <WordleRow key={i} word={words[i]} size={maxSize} />
      ))}
    </motion.div>
  );
}

export default WordleBoard;
