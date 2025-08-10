import { useEffect, useState } from 'react';
import type { GameMode } from '../hooks/useGameSetting';
import api from '../config/api';

type ScoreBoard = {
  playerName: string;
  numGuess: number;
  hasWon: boolean;
  mode: GameMode;
}[];

function ScoreBoard() {
  const [scoreBoard, setScoreBoard] = useState<ScoreBoard>([]);

  useEffect(() => {
    const getScoreBoard = async () => {
      try {
        const response = await api.get('/score');
        setScoreBoard(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getScoreBoard();
  }, []);

  return (
    <table style={tableStyles}>
      <thead>
        <tr>
          <th style={headerStyles}>Name</th>
          <th style={headerStyles}>Mode</th>
          <th style={headerStyles}>Guess Round</th>
          <th style={headerStyles}>Result</th>
        </tr>
      </thead>
      <tbody>
        {scoreBoard.map((row, index) => {
          const rowStylesMix =
            index !== scoreBoard.length - 1
              ? { ...rowStyles, ...rowBottomStyles }
              : rowStyles;

          return (
            <tr key={index} style={rowStylesMix}>
              <td>{row.playerName}</td>
              <td>
                {row.mode === 'NORMAL'
                  ? 'Normal'
                  : row.mode === 'CHEAT'
                  ? 'Cheat'
                  : 'Unknown'}
              </td>
              <td>{row.numGuess}</td>
              <td style={row.hasWon ? winStyles : loseStyles}>
                {row.hasWon ? 'Win' : 'Lose'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const tableStyles: React.CSSProperties = {
  width: '350px',
  borderCollapse: 'collapse',
};

const headerStyles: React.CSSProperties = {
  backgroundColor: '#471959',
  color: 'white',
  padding: '2px 10px',
  fontSize: '12px',
  textAlign: 'center',
};

const rowStyles: React.CSSProperties = {
  fontSize: '14px',
  textAlign: 'center',
};

const rowBottomStyles: React.CSSProperties = {
  borderBottom: '1px solid #464646',
};

const winStyles: React.CSSProperties = {
  color: 'green',
  fontWeight: '900',
};

const loseStyles: React.CSSProperties = {
  color: 'red',
  fontWeight: '900',
};

export default ScoreBoard;
