import type { GameSetting, GameSettingAction } from '../hooks/useGameSetting';

function Setting({
  state,
  dispatch,
  start,
}: {
  state: GameSetting;
  dispatch: React.ActionDispatch<[action: GameSettingAction]>;
  start: () => Promise<void>;
}) {
  return (
    <>
      <div style={settingStyles.container}>
        <label htmlFor="playerName" style={settingStyles.label}>
          Name
        </label>
        <input
          id="playerName"
          type="text"
          maxLength={20}
          value={state.playerName}
          onChange={(e) =>
            dispatch({
              type: 'set_player_name',
              payload: { playerName: e.target.value },
            })
          }
          style={settingStyles.input}
        />
        <label htmlFor="mode" style={settingStyles.label}>
          Mode
        </label>
        <select
          id="mode"
          onChange={(e) => {
            if (e.target.value === 'CHEAT') {
              dispatch({ type: 'set_cheat_mode' });
            } else {
              dispatch({ type: 'set_normal_mode' });
            }
          }}
          style={settingStyles.select}
        >
          <option value="NORMAL">Normal</option>
          <option value="CHEAT">Host Cheat</option>
        </select>
        {state.mode === 'NORMAL' && (
          <>
            <label htmlFor="round" style={settingStyles.label}>
              Round
            </label>
            <input
              id="round"
              type="number"
              min={1}
              maxLength={4}
              value={state.maxRow}
              onChange={(e) => {
                dispatch({
                  type: 'set_normal_mode',
                  payload: {
                    maxRow: e.target.value as unknown as number,
                  },
                });
              }}
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

const settingStyles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '20px',
    backgroundColor: '#303030',
    borderRadius: '6px',
    width: '240px',
  },
  label: {
    fontSize: '12px',
  },
  select: {
    padding: '8px 14px',
    backgroundColor: '#2a2a2a',
    color: '#e0e0e0',
    border: '1px solid #444',
    borderRadius: '4px',
    height: '40px',
  },
  input: {
    padding: '8px 14px',
    backgroundColor: '#2a2a2a',
    color: '#e0e0e0',
    border: '1px solid #444',
    borderRadius: '4px',
    height: '40px',
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

export default Setting;
