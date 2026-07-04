import prisma from "../utils/prisma.js";
import { type Request, type Response } from "express";


// GET / — Página do jogo (apenas usuários logados)
const index = (req: Request, res: Response) => {
  res.render("game/index", {
    layout: "main",
    fullname: req.session.fullname,
  });
};

// POST /game-session — Salva score via Ajax (#16)
const saveSession = async (req: Request, res: Response) => {
  const { score } = req.body;
  const userId = req.session.userId;

  if (!userId || score === undefined || isNaN(Number(score))) {
    res.status(400).json({ error: "Dados inválidos." });
    return;
  }

  await prisma.gameSession.create({
    data: {
      userId,
      score: Number(score),
    },
  });

  res.json({ success: true });
};

export default { index, saveSession };
