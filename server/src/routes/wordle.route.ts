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
  const parsedMaxGuessPerPlayer = parseInt(req.body.maxGuessPerPlayer);
  const maxGuessPerPlayer = isNaN(parseInt(req.body.maxGuessPerPlayer)) ? undefined : parsedMaxGuessPerPlayer

  const meta = wordleService.createGame(req.session.id, playerName, mode, maxGuessPerPlayer);

  res.status(201).json({ success: true, message: "Successfully created", meta });
})


router.post('/guess', (req, res) => {
  const word = req.body.word;
  if (!word) {
    res.status(400).json({ success: false, message: "Invalid length of word" })
    return
  }

  try {
    const result = wordleService.guess(req.session.id, word.toString());
    res.status(200).json({ success: true, message: result });

  } catch (error) {
    // user needs to get some hints from the message
    res.status(200).json({ success: false, message: (error as Error).message });
  }
})

router.post('/acknowledge', (req, res) => {
  try {
    const result = wordleService.acknowledge(req.session.id);

    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
})

export default router
