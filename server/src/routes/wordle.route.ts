import { Router } from 'express'
import WordleService from '../services/WordleService';
declare module 'express-session' {
  interface SessionData {
    loggedIn?: boolean;
  }
}
const router = Router();
export const wordleService = new WordleService();

router.post('/create', (req, res) => {
  const playerName = req.body.name?.toString();
  const mode = req.body.mode?.toString();
  const parsedmaxGuess = parseInt(req.body.maxGuess);
  const maxGuess = isNaN(parseInt(req.body.maxGuess)) ? undefined : parsedmaxGuess

  const meta = wordleService.createGame(req.session.id, playerName, mode, maxGuess);

  res.status(201).json({ success: true, message: "Successfully created", meta });
});

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

router.get('/score', (req, res) => {
  try {
    const scoreBoard = wordleService.getScoreBoard();

    res.status(200).json(scoreBoard);
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message })
  }
});


router.get('/last-game', (req, res) => {
  try {
    const lastGame = wordleService.getLastGame(req.session.id);

    res.status(200).json({ success:true, data: lastGame });

  } catch (error) {
    res.status(200).json({ success: true, data: [] })
  }
})

export default router;
