export type Status =
    "HIT" |
    "PRESENT" |
    "MISS";

export type WordleCheckResult = {
    statistic: Map<Status, number>;
    details: {
        letter: string;
        status: Status;
    }[];
}

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

        const details: WordleCheckResult['details'] = [];
        const statistic = new Map<Status, number>([
            ["HIT", 0],
            ["MISS", 0],
            ["PRESENT", 0],
        ]);

        // used for tracking the max possible number of presents
        const presentCounter = answer.split('').reduce((acc: Record<string, number>, curr, i) => {
            if (playerGuess[i] === curr) {
                return acc;
            }

            acc[curr] = (acc[curr] ?? 0) + 1
            return acc
        }, {});

        for (let i = 0; i < answer.length; i++) {
            let status: Status

            const letter = playerGuess[i];
            const targetLetter = answer[i];

            if (letter === targetLetter) {
                status = "HIT"
            } else if (presentCounter[letter] > 0) {
                presentCounter[letter] -= 1;
                status = 'PRESENT'
            } else {
                status = 'MISS'
            }

            statistic.set(status, (statistic.get(status) ?? 0) + 1)

            details.push({
                letter: playerGuess[i],
                status
            })
        }

        return {
            statistic,
            details
        };
    }
}