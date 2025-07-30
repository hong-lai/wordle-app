import WordleGame from "./WordleGame";

const wordleGame = new WordleGame({ mode: 'CHEAT' });

wordleGame.gameLoop().then(() => {

    console.log('Thank you for playing. 🥰');

});
