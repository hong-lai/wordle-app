import readline from 'node:readline/promises';
import Player from "./Player";
import Wordle, { type WordleCheckResult } from "./Wordle";
import HostCheatWordle from './HostCheatWordle';
import wordleList from "./wordleList";

export type GameMode = "NORMAL" | "CHEAT"

type WordleGameOption = {
    mode: GameMode,
    predefinedList: string[],
    maxGuess: number,
    playerName: string,
    history: WordleCheckResult[]
}

const predefinedList = wordleList.map(word => word.toUpperCase());

export default class WordleGame {
    private wordle: Wordle | HostCheatWordle;
    private player: Player;
    private predefinedList: string[];
    private maxGuess: number
    private mode: GameMode;
    private history: WordleCheckResult[];

    constructor({
        mode = "NORMAL",
        maxGuess = mode === 'CHEAT' ? -1 : 6,
        playerName = 'annoymous',
        history = [],
    }: Partial<WordleGameOption> = {}) {

        this.maxGuess = maxGuess;

        this.predefinedList = predefinedList

        this.mode = mode;

        if (mode === 'NORMAL') {
            this.wordle = new Wordle(this.pickRandomAnswer());

        } else {
            this.wordle = new HostCheatWordle(this.predefinedList);
        }

        this.player = new Player(playerName);

        this.history = history;
    }

    static fromSerialized(serialized: string) {
        try {
            const parts = serialized.split('#')

            const playerName = parts[0];
            const guesses = parts[1] === '' ? [] : parts[1].split(',');
            const mode = parts[2] as GameMode;
            const maxGuess = Number(parts[3]);
            const answer = parts[4];
            const history = parts[5] === '' ? [] : parts[5].split(',').map(guess => {
                const guessResult = guess.split('|');
                const _history = []

                for (let i = 0; i < guess[0].length; i++) {
                    const letter = guessResult[0][i];
                    const state = guessResult[1][i];

                    _history.push({
                        letter,
                        state: state === 'O' ? 'HIT' : state === '?' ? 'PRESENT' : 'MISS'
                    })
                }

                return _history;
            }) as WordleCheckResult[];

            const game = new WordleGame({
                mode,
                predefinedList,
                maxGuess,
                playerName,
                history
            });

            game.setWordleAnswer(answer);

            const player = game.getPlayer();

            guesses.forEach(guessedWord => {
                player.guess(guessedWord);
            });

            return game;

        } catch (erorr) {
            throw new Error('Error parsing the serialized data.')
        }
    }

    // Output serialized data
    toSerialized() {
        return [
            this.player.name,
            this.player.getGuesses().join(','),

            this.mode,
            this.maxGuess,
            this.wordle.getAnswer(),
            this.history.map((result) => {
                const word = result.map(letter => letter.letter).join('');
                const states = WordleGame.convertResultToText(result);
                return [word, states].join('|')
            }).join(',')

        ].join('#');
    }

    getMode() {
        return this.mode;
    }

    getHistory() {
        return this.history;
    }

    getMaxGuess() {
        return this.maxGuess === -1 ? Infinity : this.maxGuess;
    }

    getPlayer() {
        return this.player;
    }

    static convertResultToText(result: WordleCheckResult) {
        return result.map(letter =>
            letter.state === 'HIT' ? 'O' :
                letter.state === 'PRESENT' ? '?' : '_'
        ).join('');
    }

    setWordleAnswer(answer: string) {
        this.wordle.setAnswer(answer.toUpperCase());
    }

    getWordleAnswer() {
        return this.wordle.getAnswer();
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
            const currentPlayer = this.player;

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

            const hitCount = result.reduce((sum, curr) => {
                sum += (curr.state === 'HIT' ? 1 : 0)
                return sum
            }, 0);

            if (hitCount === 5) {
                console.log('[WordleGame] 🎊 You WON!!');
                isGameOver = true;
                break;

            } else if (currentPlayer.getNumGuess() >= this.getMaxGuess()) {
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

        this.player.guess(guessedWord)

        const check = this.wordle.check(this.player.getLastGuess());

        this.history.push(check);

        return check;
    }

    hasWon() {
        return this.player.getNumGuess() > 0 && this.player.getLastGuess() === this.getWordleAnswer();
    }

    hasLost() {
        return !this.hasWon() && this.player.getNumGuess() >= this.getMaxGuess();
    }
}
