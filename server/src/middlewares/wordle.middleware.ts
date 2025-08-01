import { type NextFunction, type Request, type Response } from "express";



const registerSession = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.session.loggedIn) {
    console.log("Registered a user.");
    req.session.loggedIn = true
  }

  next();
};

export default {
  registerSession
}