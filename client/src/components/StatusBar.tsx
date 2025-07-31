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
      : 'Playing...';

  const statusBarStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: "center",
    gap: "12px",
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
      {!message && gameState !== 'PLAYING' && resetComponent}
    </div>
  );
}

export default StatusBar;
