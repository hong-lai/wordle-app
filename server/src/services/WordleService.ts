import WordleGame, { type GameMode } from "@wordle/WordleGame";
import TTLMap from "../utils/TTLMap";

type WordleGameInstanceType = InstanceType<typeof WordleGame>;

declare global {
  namespace Express {
    interface Request {
      game: WordleGameInstanceType
    }
  }
}

const onHourInMs = 60 * 60 * 1000;

export default class WordleService {
  //  Storing the serialized data instead of the object itself would be better.
  private gameInstances = new TTLMap<string, WordleGameInstanceType>(onHourInMs, onHourInMs);

  createGame(sessionId: string, playerName?: string, mode?: GameMode, maxGuessPerPlayer?: number, predefinedList?: string[]) {
    if (this.gameInstances.has(sessionId)) {
      this.gameInstances.delete(sessionId);
    }

    const _playerName = playerName ?? "Smart Player";
    const _mode: GameMode = mode ?? 'NORMAL';
    const _maxGuessPerPlayer = _mode === 'CHEAT' ? Infinity : maxGuessPerPlayer;

    const game = new WordleGame({
      playerName: _playerName,
      mode: _mode,
      maxGuessPerPlayer: _maxGuessPerPlayer,
      predefinedList
    });

    this.gameInstances.set(sessionId, game);
    return {
      playerName: _playerName,
      mode: _mode,
      maxGuessPerPlayer: _maxGuessPerPlayer,
    };
  }

  private getGame(sessionId: string): WordleGame {
    const game = this.gameInstances.get(sessionId);
    if (!game) throw new Error('Game not found');
    return game;
  }

  private deleteGame(sessionId: string) {
    return this.gameInstances.delete(sessionId);
  }

  guess(sessionId: string, word: string) {
    const game = this.getGame(sessionId);

    if (game.hasWon()) {
      throw new Error("Already won");
    }

    if (game.hasLost()) {
      throw new Error("Already lost");
    }

    return game.guess(word);
  }

  // acknowledge game over
  acknowledge(sessionId: string) {
    const game = this.getGame(sessionId);

    if (game.hasWon() || game.hasLost()) {
      this.deleteGame(sessionId);

      return {
        answer: game.getWordleAnswer(),
        hasWon: game.hasWon()
      };
    }

    throw new Error("Game not over yet");
  }
}
