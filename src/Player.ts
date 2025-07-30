export default class Player {
    private _name: string;
    private guessedWords: string[];
    
    constructor(name: string) {
        this._name = name;
        this.guessedWords = [];
    }

    get name() {
        return this._name;
    }

    guess(word: string) {
        this.guessedWords.push(word);
    }

    getLastGuess() {
        if (this.guessedWords.length === 0) {
            throw new Error(`[Player] Oops, ${this.name} didn't guess anything yet. 😭`)
        }

        return this.guessedWords[this.getNumGuess() - 1]
    }

    getNumGuess() {
        return this.guessedWords.length;
    }
}