import { type Request, type Response, type NextFunction } from "express";
import fs from "fs/promises"

type LogType = "simple" | "complete";

function logger(type: LogType) {
  if ((type === "simple")) {
    return (req: Request, res: Response, next: NextFunction) => {
      console.log("log simple")
      next()
    };
  } else {
    return (req: Request, res: Response, next: NextFunction) => {
      console.log("log complete")
      next()
    };
  }
}

export default logger;
