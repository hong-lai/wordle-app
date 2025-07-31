import { useEffect, useRef } from 'react';
import type { Word } from '../../App';
import Box from './WordleLetterBox';

export function WordleRow({ word, size }: { word: Word; size: number }) {
  const rowRef = useRef<HTMLDivElement>(null);

  const rowStyles: React.CSSProperties = {
    display: 'flex',
    columnGap: '6px',
    justifyContent: "center"
  };

  useEffect(() => {
    rowRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }, []);

  return (
    <div ref={rowRef} style={rowStyles}>
      {Array.from({ length: size }).map((_, i) => (
        <Box key={i} letter={word[i]} />
      ))}
    </div>
  );
}

export default WordleRow;
