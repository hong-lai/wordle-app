import { describe, it } from "node:test";
import assert from "node:assert";
import WordleGame from "../WordleGame";

describe("Wordle Game", () => {

    it('should be case insensitive for input', () => {
        const wordleGame = new WordleGame({});

        wordleGame.setWordleAnswer("HelLo");
        const resultA = wordleGame.guess('WorlD');
        assert.equal(WordleGame.convertResultToText(resultA), '_?_O_');
    })

});