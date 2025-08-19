import { Router } from 'express'
import WordleService from '../services/WordleService';
declare module 'express-session' {
  interface SessionData {
    loggedIn?: boolean;
  }
}
const router = Router();
export const wordleService = new WordleService();

// Create a Wordle game.
router.post('/create', (req, res) => {
  const playerName = req.body.name?.toString()?.replace(/[^a-zA-Z ]/g, '_');
  const mode = req.body.mode?.toString();
  const parsedmaxGuess = parseInt(req.body.maxGuess);
  const maxGuess = isNaN(parseInt(req.body.maxGuess)) ? undefined : parsedmaxGuess

  const result = wordleService.createGame(req.session.id, playerName, mode, maxGuess);

  res.status(201).json({ success: true, result });
});

// Make a guess and check whether the player wins the game
router.post('/guess', (req, res) => {
  const word = req.body.word;
  if (!word) {
    res.status(400).json({ success: false, message: "Invalid length of word" })
    return
  }

  try {
    const { playerName } = wordleService.getPlayerInfo(req.session.id);
    req.log.info(`${playerName} made a guess: ${word}`);

    const result = wordleService.guess(req.session.id, word.toString());

    res.status(200).json({ success: true, result });

  } catch (error) {
    // user needs to get some hints from the message
    res.status(200).json({ success: false, message: (error as Error).message });
  }
});

// Get the game in playing
router.get('/last-game', (req, res) => {
  const result = wordleService.getLastGame(req.session.id);

  res.status(200).json({ success: true, result });
});


// Get the score board
router.get('/score', (_req, res) => {
  const scoreBoard = wordleService.getScoreBoard();

  res.status(200).json(scoreBoard);
});


export default router;
