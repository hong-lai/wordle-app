import { useEffect, useRef } from 'react';
import LetterBox from './LetterBox';
import type { Word } from '../../hooks/useGameState';

export function WordleRow({ word, size }: { word: Word; size: number }) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    rowRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  return (
    <div ref={rowRef} style={rowStyles}>
      {Array.from({ length: size }).map((_, i) => (
        <LetterBox key={i} letter={word[i]} index={i} />
      ))}
    </div>
  );
}

const rowStyles: React.CSSProperties = {
  display: 'flex',
  columnGap: '6px',
  justifyContent: 'center',
};

export default WordleRow;
