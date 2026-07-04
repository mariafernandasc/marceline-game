import prisma from "../utils/prisma.js";
import { type Request, type Response } from "express";


// GET /ranking — Top 10 usuários com maior pontuação (#17)
const index = async (req: Request, res: Response) => {

  // Agrupa por usuário, pega o maior score de cada um,
  // ordena decrescente e limita a 10
  const rawRanking = await prisma.gameSession.groupBy({
    by: ["userId"],
    _max: { score: true },
    orderBy: { _max: { score: "desc" } },
    take: 10,
  });

  // Busca o nome de cada usuário
  const ranking = await Promise.all(
    rawRanking.map(async (entry, index) => {
      const user = await prisma.user.findUnique({
        where: { id: entry.userId },
        select: { fullname: true },
      });
      return {
        position: index + 1,
        fullname: user?.fullname ?? "Usuário desconhecido",
        score: entry._max.score ?? 0,
      };
    })
  );

  res.render("ranking/index", {
    layout: "main",
    ranking,
    fullname: req.session.fullname,
  });
};

export default { index };
