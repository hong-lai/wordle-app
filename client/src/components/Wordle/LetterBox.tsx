import { useEffect, useMemo, useState } from 'react';
import type { Letter, State } from '../../hooks/useGameState';
import { letterColor } from './color';

function LetterBox({ letter, index }: { letter?: Letter; index: number }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (letter?.letter) {
      setPulse(true);
    }
  }, [letter?.letter]);

  const styles = useMemo(() => {
    const isChecked =
      letter?.state === 'MISS' ||
      letter?.state === 'PRESENT' ||
      letter?.state === 'HIT';

    const checkedColors: Record<State, string> = letterColor;

    const box: React.CSSProperties = {
      height: '60px',
      width: '60px',
      border: '4px solid #3d3627',
      fontSize: '40px',
      fontWeight: '700',
      userSelect: 'none',
      position: 'relative',
      transformStyle: 'preserve-3d',
      transition: 'transform 450ms ease-out',
      transitionDelay: `${200 * index + 170}ms`,
      transform: isChecked ? 'rotateX(180deg)' : 'none',
      textShadow: '0 1px 0 #252525a1',
    };

    const front: React.CSSProperties = {
      ...sharedFace,
    };

    const back: React.CSSProperties = {
      ...sharedFace,
      transform: 'rotateX(180deg)',
      backgroundColor: checkedColors[letter?.state ?? 'UNKNOWN'],
    };

    return { box, front, back };
  }, [letter, index]);

  return (
    <div style={styles.box}>
      <div
        style={styles.front}
        data-animation={pulse ? 'pulse' : 'none'}
        onAnimationEnd={() => setPulse(false)}
      >
        {letter?.letter ?? ''}
      </div>
      <div style={styles.back}>{letter?.letter ?? ''}</div>
    </div>
  );
}

const sharedFace: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'grid',
  placeContent: 'center',
  backfaceVisibility: 'hidden',
};

export default LetterBox;
