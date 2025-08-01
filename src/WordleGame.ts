import readline from 'node:readline/promises';
import Player from "./Player";
import Wordle, { type WordleCheckResult } from "./Wordle";
import HostCheatWordle from './HostCheatWordle';
import wordleList from "./wordleList";

export type GameMode = "NORMAL" | "CHEAT"

type WordleGameOption = {
    mode: GameMode,
    predefinedList: string[],
    maxGuessPerPlayer: number,
    playerName: string
}

const defaultPredefinedList = wordleList

export default class WordleGame {
    private maxGuessPerPlayer: number
    private players: Map<Player, number>
    private wordle: Wordle | HostCheatWordle;
    private currentPlayer: Player;
    private predefinedList: string[];

    // assume at least one player is needed
    constructor({
        mode = "NORMAL",
        predefinedList = defaultPredefinedList,
        maxGuessPerPlayer = mode === 'CHEAT' ? Infinity : 6,
        playerName = 'annoymous'
    }: Partial<WordleGameOption> = {}) {

        this.maxGuessPerPlayer = maxGuessPerPlayer;

        this.predefinedList = predefinedList.map(word => word.toUpperCase());

        if (mode === 'NORMAL') {
            this.wordle = new Wordle(this.pickRandomAnswer());

        } else {
            this.wordle = new HostCheatWordle(this.predefinedList);
        }

        this.players = new Map();
        const player = this.addPlayer(playerName);
        this.currentPlayer = player;
    }

    getMaxGuessPerPlayer() {
        return this.maxGuessPerPlayer;
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }

    static convertResultToText(result: WordleCheckResult) {
        return result.details.map(detail =>
            detail.status === 'HIT' ? 'O' :
                detail.status === 'PRESENT' ? '?' : '_'
        ).join('');
    }

    addPlayer(name: string): Player {
        const player = new Player(name);
        this.setPlayer(player);
        return player;
    }

    setWordleAnswer(answer: string) {
        this.wordle.setAnswer(answer.toUpperCase());
    }

    getWordleAnswer() {
        return this.wordle.getAnswer();
    }

    private setPlayer(player: Player) {
        this.players.set(player, this.players.size + 1);
    }

    private pickRandomAnswer() {
        return this.predefinedList[Math.floor(Math.random() * this.predefinedList.length)];
    }

    private isValidWord(word: string) {
        return this.predefinedList.includes(word);
    }

    async gameLoop() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        let isGameOver = false;

        while (!isGameOver) {
            const currentPlayer = this.currentPlayer;

            const input = await rl.question(`[${currentPlayer.name}|${currentPlayer.getNumGuess() + 1}]: `);

            let result: WordleCheckResult;

            try {
                result = this.guess(input);

            } catch (error) {
                if (error instanceof Error) {
                    console.log('[WordleGame]', error.message);
                }
                continue;
            }

            console.log('[WordleGame]:', WordleGame.convertResultToText(result));

            const hitCount = result.details.reduce((sum, curr) => {
                sum += (curr.status === 'HIT' ? 1 : 0)
                return sum
            }, 0);

            if (hitCount === 5) {
                console.log('[WordleGame] 🎊 You WON!!');
                isGameOver = true;
                break;

            } else if (currentPlayer.getNumGuess() >= this.maxGuessPerPlayer) {
                console.log(`[WordleGame] 🙁 You lost. The anwser is ${this.wordle.getAnswer()}`)
                isGameOver = true;
                break;
            }
        }

        rl.close();
    }

    guess(word: string) {
        const guessedWord = word.toUpperCase();

        if (this.hasWon() || this.hasLost()) {
            throw new Error("Game Over");
        }

        if (guessedWord.length !== 5) {
            throw new Error("Hey! Incorrect word length!");
        }

        if (!this.isValidWord(guessedWord)) {
            throw new Error("Word not in the predefined list.")
        }

        this.currentPlayer.guess(guessedWord)

        const check = this.wordle.check(this.currentPlayer.getLastGuess());

        return check;
    }

    hasWon() {
        return this.currentPlayer.getNumGuess() > 0 && this.currentPlayer.getLastGuess() === this.getWordleAnswer();
    }

    hasLost() {
        return !this.hasWon() && this.currentPlayer.getNumGuess() >= this.maxGuessPerPlayer;
    }
}
