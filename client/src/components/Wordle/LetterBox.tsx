import { useEffect, useMemo, useState } from 'react';
import type { Letter, Status } from '../../hooks/useGameState';

function LetterBox({ letter, index }: { letter?: Letter; index: number }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (letter?.letter) {
      setPulse(true);
    }
  }, [letter?.letter]);

  const styles = useMemo(() => {
    const isChecked =
      letter?.status === 'MISS' ||
      letter?.status === 'PRESENT' ||
      letter?.status === 'HIT';

    const checkedColors: Record<Status, string> = {
      MISS: '#9b9b9b',
      PRESENT: '#e4c422',
      HIT: '#0fc64f',
      UNKNOWN: 'none',
    };

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
      transitionDelay: `${450 * index + 450}ms`,
      transform: isChecked ? 'rotateX(180deg)' : 'none',
      textShadow: '0 1px 0 #252525a1',
    };

    const front: React.CSSProperties = {
      ...sharedFace,
    };

    const back: React.CSSProperties = {
      ...sharedFace,
      transform: 'rotateX(180deg)',
      backgroundColor: checkedColors[letter?.status ?? 'UNKNOWN'],
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
