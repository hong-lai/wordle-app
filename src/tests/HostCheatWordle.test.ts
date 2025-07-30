import { describe, it } from "node:test";
import assert from "node:assert";
import WordleGame from "../WordleGame";

describe("Host Cheat Wordle checker", () => {

    it('should not be all hits in the first attempt', () => {
        const testList = [
            "HELLO",
            "WORLD",
        ];

        const wordleGameA = new WordleGame({ mode: 'CHEAT', predefinedList: testList });
        const resultA = wordleGameA.guess('HELLO');
        assert.notEqual(WordleGame.convertResultToText(resultA), 'OOOOO');

        const wordleGameB = new WordleGame({ mode: 'CHEAT', predefinedList: testList });
        const resultB = wordleGameB.guess('WORLD');
        assert.notEqual(WordleGame.convertResultToText(resultB), 'OOOOO');
    })

    it('should guess at the last time if all candidates are mutually exclusive', () => {
        const testList = [
            "AAAAA",
            "BBBBB",
            "CCCCC"
        ];
        const guessLists = [
            ["AAAAA", "BBBBB", "CCCCC"],
            ["AAAAA", "CCCCC", "BBBBB"],
            ["CCCCC", "AAAAA", "BBBBB"],
            ["CCCCC", "BBBBB", "AAAAA"],
            ["BBBBB", "AAAAA", "CCCCC"],
            ["BBBBB", "CCCCC", "AAAAA"],
        ];

        for (const [first, second, third] of guessLists) {
            console.log(first, second, third)
            const wordleGame = new WordleGame({ mode: 'CHEAT', predefinedList: testList });
    
            const resultA = wordleGame.guess(first);
            assert.notEqual(WordleGame.convertResultToText(resultA), 'OOOOO');
    
            const resultB = wordleGame.guess(second);
            assert.notEqual(WordleGame.convertResultToText(resultB), 'OOOOO');
    
            const resultC = wordleGame.guess(third);
            assert.equal(WordleGame.convertResultToText(resultC), 'OOOOO');
        }
    })
});