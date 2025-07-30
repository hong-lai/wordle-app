import WordleGame from "./WordleGame";
import wordleList from "./wordleList";

const wordleGame = new WordleGame({ mode: 'NORMAL', predefinedList: wordleList });

wordleGame.gameLoop().then(() => {

    console.log('Thank you for playing. 🥰');

});
