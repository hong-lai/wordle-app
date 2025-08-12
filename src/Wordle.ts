export type State =
    "HIT" |
    "PRESENT" |
    "MISS";

export type WordleCheckResult = {
    letter: string;
    state: State;
}[];

export default class Wordle {
    private answer: string;

    constructor(answer: string) {
        this.answer = answer;
    }

    setAnswer(answer: string) {
        this.answer = answer;
    }

    getAnswer() {
        return this.answer;
    }

    check(playerGuess: string): WordleCheckResult {
        const answer = this.answer;

        const checkResult: WordleCheckResult = [];

        // used for tracking the max possible number of presents
        const presentCounter = answer.split('').reduce((acc: Record<string, number>, curr, i) => {
            if (playerGuess[i] === curr) {
                return acc;
            }

            acc[curr] = (acc[curr] ?? 0) + 1
            return acc
        }, {});

        for (let i = 0; i < answer.length; i++) {
            let state: State

            const letter = playerGuess[i];
            const targetLetter = answer[i];

            if (letter === targetLetter) {
                state = "HIT"
            } else if (presentCounter[letter]-- > 0) {
                state = 'PRESENT'
            } else {
                state = 'MISS'
            }

            checkResult.push({
                letter: playerGuess[i],
                state
            })
        }

        return checkResult;
    }
}