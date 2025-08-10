import WordleGame from "./WordleGame";

const wordleGame = new WordleGame({ mode: 'NORMAL' });

function main() {
    wordleGame.gameLoop().then(() => {

        console.log('Thank you for playing. 🥰');

    }).catch(_ => {

        console.clear();
        console.log("Bye~");

    });
}

if (require.main === module) {
    main();;
}

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('[SIGINT] Graceful shutdown');
    process.exit(0);
})

process.on('SIGTERM', () => {
    console.log('[SIGTERM] Graceful shutdown');
    process.exit(0);
})

process.on('exit', (code) => {
    console.log(`[${code}] Graceful shutdown`);
    process.exit(0);
})