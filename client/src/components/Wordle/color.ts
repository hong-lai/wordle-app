import type { State } from "../../hooks/useGameState";

export const letterColor: Record<State, string> = {
    MISS: '#3c3c3c',
    PRESENT: '#e4c422',
    HIT: '#0fc64f',
    UNKNOWN: 'none'
};