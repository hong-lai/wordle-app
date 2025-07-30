import { describe, it } from "node:test";
import Wordle from "../Wordle";
import Player from "../Player";
import assert from "node:assert";
import WordleGame from "../WordleGame";

describe("Wordle checker", () => {

    it('should pass all the checks', () => {
        const wordle = new Wordle("sushi");
        const player = new Player('tester');
    
        player.guess("super")
        const resultA = wordle.check(player.getLastGuess())
        assert.equal(WordleGame.convertResultToText(resultA), 'OO___')

        player.guess("sense")
        const resultB = wordle.check(player.getLastGuess())
        assert.equal(WordleGame.convertResultToText(resultB), 'O__?_')

        player.guess("sushi")
        const resultC = wordle.check(player.getLastGuess())
        assert.equal(WordleGame.convertResultToText(resultC), 'OOOOO')
    })

    it('should not show the extra presents if all hits are fulfilled', () => {
        const wordle = new Wordle('aaabb');
        const player = new Player('tester');
    
        player.guess("bbbbb")
        const resultA = wordle.check(player.getLastGuess())
        assert.equal(WordleGame.convertResultToText(resultA), '___OO')

        player.guess("aaaaa")
        const resultB = wordle.check(player.getLastGuess())
        assert.equal(WordleGame.convertResultToText(resultB), 'OOO__')
    })

});