import { useReducer } from "react";

export type GameMode = 'NORMAL' | 'CHEAT';

export type GameSetting = {
  maxRow: number;
  minRow: number;
  mode: GameMode;
  playerName: string;
};

export type GameSettingAction =
  | { type: 'set_player_name'; payload: { playerName: string } }
  | { type: 'set_normal_mode'; payload?: { maxRow: number } }
  | { type: 'set_cheat_mode' };


const initialGameSetting = {
  maxRow: 6,
  minRow: 6,
  mode: 'NORMAL' as GameMode,
  playerName: 'Player',
};

function useGameSetting() {
  const gameSettingReducer = (
    prevState: GameSetting,
    action: GameSettingAction
  ) => {
    switch (action.type) {
      case 'set_player_name': {
        return {
          ...prevState,
          playerName: action.payload.playerName,
        };
      }

      case 'set_normal_mode': {
        return {
          ...prevState,
          mode: 'NORMAL' as GameMode,
          maxRow: action?.payload?.maxRow ?? (prevState.maxRow === Infinity ? 6 : prevState.maxRow),
          minRow: Math.min(action?.payload?.maxRow ?? prevState.maxRow, 6),
        };
      }

      case 'set_cheat_mode': {
        return {
          ...prevState,
          mode: 'CHEAT' as GameMode,
          maxRow: Infinity,
          minRow: 6,
        };
      }

      default: {
        throw new Error('Action type not found.');
      }
    }
  };

  return useReducer(gameSettingReducer, initialGameSetting);
}



export default useGameSetting;