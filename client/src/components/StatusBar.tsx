import type { GameState } from '../App';

function StatusBar({
  gameState,
  message,
  resetComponent,
}: {
  gameState: GameState;
  message: string;
  resetComponent: React.JSX.Element;
}) {
  const status =
    gameState === 'WIN'
      ? 'You won 🏆'
      : gameState === 'LOSE'
      ? 'You lost 😞'
      : gameState === 'PLAYING'
      ? 'Playing...'
      : 'Waiting...';

  const statusBarStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '24px',
    gap: '12px',
    fontSize: '14px',
    fontWeight: '700',
    backgroundColor: '#161616',
    padding: '6px',
    borderRadius: '6px',
  };

  return (
    <div style={statusBarStyles}>
      {message}
      {!message && <span>{status}</span>}
      {!message && (gameState === 'WIN' || gameState === 'LOSE') && resetComponent}
    </div>
  );
}

export default StatusBar;
