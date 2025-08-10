import { useState } from 'react';
import ScoreBoard from '../components/ScoreBoard';

function Header() {
  const [showScoreBoard, setShowScoreBoard] = useState(false);

  const handleClickOverlay = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      setShowScoreBoard(false);
    }
  };

  return (
    <div style={styles}>
      <h2 onClick={() => setShowScoreBoard(true)}>WORDLE APP 👾</h2>
      {showScoreBoard && (
        <div style={overlayStyles} onClick={handleClickOverlay}>
          <div style={{ minHeight: '70vh' }} onClick={handleClickOverlay}>
            <div style={scoreboardContainerStyles}>
              <ScoreBoard />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: React.CSSProperties = {
  position: 'sticky',
  backgroundColor: '#242424',
  top: '0',
  zIndex: 100,
};

const overlayStyles: React.CSSProperties = {
  position: 'fixed',
  inset: '0',
  zIndex: 100,
  background: 'rgba(27, 27, 27, 0.3)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  columnGap: '12px',
};

const scoreboardContainerStyles: React.CSSProperties = {
  padding: '4px',
  border: '6px solid #323232',
  backgroundColor: '#282828d8',
};

export default Header;
