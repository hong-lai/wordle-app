import { describe, it } from "node:test";
import Player from "../Player";
import assert from "node:assert";

describe("Player Guess State", () => {

    it('should return the correct last guess after a few guesses', () => {
        const player = new Player('tester');
        player.guess("A");
        player.guess("B");
        player.guess("C");
        player.guess("D");
        player.guess("E");

        const lastGuess = player.getLastGuess();

        assert.equal(lastGuess, 'E');
    })

    it('should return the correct number of guesses after a few guesses', () => {
        const player = new Player('tester');
        player.guess("A");
        player.guess("B");
        player.guess("C");
        player.guess("D");
        player.guess("E");

        const numGuess = player.getNumGuess();

        assert.equal(numGuess, 5);
    })

});