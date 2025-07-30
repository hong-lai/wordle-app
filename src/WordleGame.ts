import readline from 'node:readline/promises';
import Player from "./Player";
import Wordle, { WordleCheckResult } from "./Wordle";
import HostCheatWordle from './HostCheatWordle';

type GameMode = "NORMAL" | "CHEAT"

type WordleGameOption = {
    mode: GameMode,
    predefinedList: string[],
    maxGuessPerPlayer: number,
    playerName: string
}

const defaultPredefinedList = [
    "HELLO",
    "WORLD",
    "QUITE",
    "FANCY",
    "FRESH",
    "PANIC",
    "CRAZY",
    "BUGGY",
    "SCARE"
]

export default class WordleGame {
    private maxGuessPerPlayer: number
    private players: Map<Player, number>
    private wordle: Wordle | HostCheatWordle;
    private currentPlayer: Player;
    private isGameOver: boolean;
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

        this.isGameOver = false;
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

        while (!this.isGameOver) {
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

            if (result.statistic.get('HIT') === 5) {
                console.log('[WordleGame] 🎊 You WON!!');
                this.isGameOver = true;
                break;

            } else if (currentPlayer.getNumGuess() >= this.maxGuessPerPlayer) {
                console.log('[WordleGame] 🙁 You lost.')
                this.isGameOver = true;
                break;
            }
        }

        rl.close();
    }

    guess(word: string) {
        const guessedWord = word.toUpperCase();

        if (guessedWord.length !== 5) {
            throw new Error("Hey! Incorrect word length!");
        }

        if (!this.isValidWord(guessedWord)) {
            throw new Error("Word not in the predefined list.")
        }

        this.currentPlayer.guess(guessedWord)

        return this.wordle.check(this.currentPlayer.getLastGuess());
    }
}
