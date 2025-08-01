import type { GameMode } from '@wordle/WordleGame';

const settingStyles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '20px',
    backgroundColor: '#303030',
    borderRadius: '6px',
    width: '240px'
  },
  label: {
    fontSize: '12px',
  },
  select: {
    padding: '8px',
    backgroundColor: '#2a2a2a',
    color: '#e0e0e0',
    border: '1px solid #444',
    borderRadius: '4px',
  },
  input: {
    padding: '8px 14px',
    backgroundColor: '#2a2a2a',
    color: '#e0e0e0',
    border: '1px solid #444',
    borderRadius: '4px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007acc',
    color: '#e0e0e0',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '6px',
  },
};

function GameSetting({
  setMode,
  setMaxRow,
  start,
  maxRow,
  mode,
}: {
  setMode: React.Dispatch<React.SetStateAction<GameMode>>;
  setMaxRow: React.Dispatch<React.SetStateAction<number>>;
  start: () => Promise<void>;
  maxRow: number;
  mode: GameMode;
}) {
  return (
    <>
      <div style={settingStyles.container}>
        <label htmlFor="mode" style={settingStyles.label}>
          Mode
        </label>
        <select
          id="mode"
          onChange={(e) => setMode(e.target.value as GameMode)}
          style={settingStyles.select}
        >
          <option value="NORMAL">Normal</option>
          <option value="CHEAT">Host Cheat</option>
        </select>
        {mode === 'NORMAL' && (
          <>
            <label htmlFor="round" style={settingStyles.label}>
              Round
            </label>
            <input
              id="round"
              type="number"
              min={1}
              maxLength={4}
              value={maxRow}
              onChange={(e) => setMaxRow(e.target.value as unknown as number)}
              style={settingStyles.input}
            />
          </>
        )}

        <button onClick={start} style={settingStyles.button}>
          OK
        </button>
      </div>
    </>
  );
}

export default GameSetting;
