# Wordle App

A simple text-based Wordle App.

## Features
- Play Wordle in a terminal
- Two modes available: `normal` and `host-cheat`
- Customizable maximum guesses per player

## Usage
- Choose between `normal` and `host-cheat` modes (For now, you need to set it in `index.ts`)
- Customizable maximum guesses per player (default is 6, you may change it in `index.ts`)
- Predefined word list can also be set in `WordleGame.js` or passed as an argument in `index.ts`

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

## How to Play
1. Enter a 5-letter word as your guess.
2. The app will output feedback:
   - `O` for correct letter in the correct position
   - `?` for correct letter in the wrong position
   - `_` for incorrect letter
3. Continue guessing until you find the correct word or run out of guesses.


## Future Enhancements
- Implement a web-based React App for better user experience
- Add multiplayer support
- Add fancy animations on the UI
