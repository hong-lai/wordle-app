import WordleGame, { type GameMode } from "@wordle/WordleGame";
import TTLMap from "../utils/TTLMap";
import { randomUUID } from "node:crypto";

type ScoreBoard = {
  mode: GameMode,
  hasWon: boolean,
  playerName: string,
  numGuess: number,
  maxGuess: number,
  answer: string
}[]


const gameLocalDb = new TTLMap<string, string>({ ttl: '30d', checkInterval: '30d' });
export default class WordleService {
  createGame(sessionId: string, playerName?: string, mode?: GameMode, maxGuess?: number) {
    if (gameLocalDb.has(sessionId)) {
      // Change the id of the game in the pass to prevent from overriding data
      gameLocalDb.set(randomUUID(), gameLocalDb.get(sessionId)!);
      gameLocalDb.delete(sessionId);
    }

    const option = {
      playerName: playerName ?? "Player",
      mode: mode ?? 'NORMAL',
      maxGuess: mode === 'CHEAT' ? -1 : maxGuess,
    }

    const game = new WordleGame(option);

    gameLocalDb.set(sessionId, game.toSerialized());

    return option;
  }

  private getGame(sessionId: string): WordleGame {
    const serialized = gameLocalDb.get(sessionId);

    if (!serialized) throw new Error('Game not found');

    return WordleGame.fromSerialized(serialized);
  }

  deleteGame(sessionId: string) {
    return gameLocalDb.delete(sessionId);
  }

  getPlayerInfo(sessionId: string) {
    const game = this.getGame(sessionId);
    const player = game.getPlayer();

    return {
      playerName: player.name,
      numGuess: player.getNumGuess()
    };
  }

  guess(sessionId: string, word: string) {
    const game = this.getGame(sessionId);

    if (game.hasWon()) {
      throw new Error("Already won");
    }

    if (game.hasLost()) {
      throw new Error("Already lost");
    }

    const guessResult = game.guess(word);

    // Update game state
    gameLocalDb.set(sessionId, game.toSerialized());

    return {
      guessResult,
      hasWon: game.hasWon(),
      hasLost: game.hasLost(),
      answer: game.isGameOver() ? game.getWordleAnswer() : ''
    };
  }

  getScoreBoard() {
    const scoreBoard: ScoreBoard = [];

    gameLocalDb.forEach(serialzed => {
      const game = WordleGame.fromSerialized(serialzed);

      if (game.isGameOver()) {
        scoreBoard.push({
          mode: game.getMode(),
          hasWon: game.hasWon(),
          answer: game.getWordleAnswer(),
          maxGuess: game.getMaxGuess(),
          playerName: game.getPlayer().name,
          numGuess: game.getPlayer().getNumGuess()
        });
      }
    });

    return scoreBoard;
  }

  getLastGame(sessionId: string) {
    try {

      const game = this.getGame(sessionId);
      const playerName = game.getPlayer().name;
      const history = game.getHistory();
      const mode = game.getMode();
      const maxGuess = game.getMaxGuess();

      if (game.isGameOver()) {
        throw new Error('Game over');
      }

      return {
        hasLastGame: true,
        details: {
          playerName,
          history,
          mode,
          maxGuess
        }
      };
    } catch (_) {
      return {
        hasLastGame: false
      }
    }
  }
}
