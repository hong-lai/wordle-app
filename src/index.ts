import WordleGame from "./WordleGame";

const wordleGame = new WordleGame({ mode: 'NORMAL' });

function main() {
    wordleGame.gameLoop().then(() => {

        console.log('Thank you for playing. 🥰');

    });
}

if (require.main === module) {
    main();;
}