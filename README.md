# Wordle App

A simple text-based Wordle App.

Client and server apps are also avaliable:
- [Go to Client Folder](client/)
- [Go to Server Folder](server/)


## Features
- Play Wordle in a terminal
- Two modes available: `normal` and `host-cheat`
- Customizable maximum guesses per player


## Quick Start
Please ensure you have the minimum Node.js version of 23.x installed.
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the app:
   ```bash
   npm start
   ```
3. Run tests:
   ```bash
   npm test
   ```
4. Run local server (default port is 5173):
   ```bash
   npm run dev:server
   ```
5. Run local client (default port is 5555):
   ```bash
   npm run dev:client
   ```

## How to Play
1. Enter a 5-letter word as your guess.
2. The app will output feedback:
   - `O` for correct letter in the correct position
   - `?` for correct letter in the wrong position
   - `_` for incorrect letter
3. Continue guessing until you find the correct word or run out of guesses.
