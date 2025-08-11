# Wordle App

A simple Wordle App that can be played in the terminal or through a web client.
This project is built with Node.js and TypeScript, featuring a client-server architecture.


## Features
- Play Wordle in a terminal, or through a web client
- Two modes available: `normal` and `host-cheat`
- Customizable maximum guesses per player


## Quick Start (Terminal App)
Please ensure you have the minimum Node.js version of 23.x installed.
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the app:
   ```bash
   npm run start:cli
   ```
3. Run tests:
   ```bash
   npm test
   ```

## Quick Start (Client and Server Apps)
This client app needs the server to run properly, please ensure the server is running before running the client app.
- [Demo (Live on Azure)](https://wordle-app-server.azurewebsites.net/)
- [Go to Server Folder](server/)
- [Go to Client Folder](client/)

1. Install dependencies for both client and server:
   ```bash
   npm install
   ```
2. Run local server (default port is 5173):
   ```bash
   npm run dev:server
   ```
3. Run local client (default port is 5555):
   ```bash
   npm run dev:client
   ```

## How to Play
1. Enter a 5-letter word as your guess.
2. The app will output feedback:
   - `O` for correct letter in the correct position, or `GREEN` color in the web client
   - `?` for correct letter in the wrong position, or `YELLOW` color in the web client
   - `_` for incorrect letter, or `GRAY` color in the web client
3. Continue guessing until you find the correct word or run out of guesses.


## Future Enhancements
- Add multiplayer support