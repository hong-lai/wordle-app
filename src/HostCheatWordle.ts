import Wordle, { type WordleCheckResult } from "./Wordle";

export default class HostCheatWordle extends Wordle {

    private candidates: Set<string>;

    constructor(predefinedList: string[]) {
        super("");
        this.candidates = new Set(predefinedList);
    }

    private canCheat() {
        return this.getAnswer() === '';
    }

    override check(guess: string): WordleCheckResult {
        if (this.canCheat()) {
            return this.cheat(guess);
        } else {
            return super.check(guess);
        }
    }

    cheat(guess: string): WordleCheckResult {
        const remainingCandidates: Set<string> = new Set();

        const minScoreWord = {
            score: Infinity,
            word: ''
        }

        for (const word of this.candidates) {
            const wordle = new Wordle(word);
            const result = wordle.check(guess)

            const hit = result.reduce((sum, curr) => sum + (curr.state === 'HIT' ? 1 : 0), 0);
            const present = result.reduce((sum, curr) => sum + (curr.state === 'PRESENT' ? 1 : 0), 0);
            const miss = result.reduce((sum, curr) => sum + (curr.state === 'MISS' ? 1 : 0), 0);

            const wordSize = word.length;

            if (miss === wordSize) {
                remainingCandidates.add(word);

            } else {
                const score = (hit * (wordSize + 1)) + present;

                if (minScoreWord.score >= score) {
                    minScoreWord.score = score;
                    minScoreWord.word = word;
                }
            }
        }

        if (remainingCandidates.size === 0) {
            this.setAnswer(minScoreWord.word);
            return this.check(guess);

        } else {
            this.candidates = remainingCandidates;

            return guess.split('').map(letter => ({
                letter,
                state: "MISS"
            }));
        }
    }
}