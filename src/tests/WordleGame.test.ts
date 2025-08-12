import { describe, it } from "node:test";
import assert from "node:assert";
import WordleGame from "../WordleGame";

describe("Wordle Game", () => {

    it('should be case insensitive for input', () => {
        const game = new WordleGame();

        game.setWordleAnswer("HelLo");
        const resultA = game.guess('WorlD');
        assert.equal(WordleGame.convertResultToText(resultA), '_?_O_');
    });

    it('shoud set the maxGuess to Infinity if the mode sets to CHEAT', () => {
        const game = new WordleGame({
            mode: 'CHEAT',
            maxGuess: 10, // regardless of the value here
        });

        assert.equal(game.getMaxGuess(), Infinity);
    });

    it('should be able to return the corresponding private properties of interest', () => {
        const game = new WordleGame({
            mode: 'CHEAT',
            playerName: 'Tester',
        });

        game.setWordleAnswer('HAPPY');

        game.guess('BUGGY');
        game.guess('LUCKY');

        // Setting
        assert.equal(game.getMaxGuess(), Infinity);
        assert.equal(game.getMode(), 'CHEAT');

        // Player
        assert.equal(game.getPlayer().name, 'Tester');
        assert.deepEqual(game.getPlayer().getGuesses(), ['BUGGY', 'LUCKY']);
        assert.equal(game.getPlayer().getLastGuess(), 'LUCKY');
        assert.equal(game.getPlayer().getNumGuess(), 2);

        // Game
        assert.equal(game.getWordleAnswer(), 'HAPPY');
        assert.deepEqual(game.getHistory(), [
            [
                { letter: 'B', state: 'MISS' },
                { letter: 'U', state: 'MISS' },
                { letter: 'G', state: 'MISS' },
                { letter: 'G', state: 'MISS' },
                { letter: 'Y', state: 'HIT' }
            ],
            [

                { letter: 'L', state: 'MISS' },
                { letter: 'U', state: 'MISS' },
                { letter: 'C', state: 'MISS' },
                { letter: 'K', state: 'MISS' },
                { letter: 'Y', state: 'HIT' }
            ]
        ]);
    })

    it('should return serialized data and convert back to game instance correctly', () => {
        const game = new WordleGame({
            mode: 'NORMAL',
            maxGuess: 20,
            playerName: 'Tester',
        });

        game.setWordleAnswer('BINGO')
        game.guess('HELLO');
        game.guess('WORLD');
        game.guess('CRASH');

        const serialized = game.toSerialized();

        assert.equal(serialized, 'Tester#HELLO,WORLD,CRASH#NORMAL#20#BINGO');

        const restoredGame = WordleGame.fromSerialized(serialized);

        assert.deepEqual(restoredGame, game);
    });
});