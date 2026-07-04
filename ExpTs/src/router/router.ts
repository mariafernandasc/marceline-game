import { Router } from "express";
import mainController from "../controllers/main.js";
import loremController from "../controllers/lorem.js";
import gameController from "../controllers/game.js";
import rankingController from "../controllers/ranking.js";
import authController from "../controllers/auth.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = Router();

// Rotas do professor (mantidas intactas)
router.get("/about", mainController.about);
router.get("/bem-vindo/:nome/:sobrenome", mainController.bemvindo);
router.get("/hb1", mainController.hb1);
router.get("/hb2", mainController.hb2);
router.get("/hb3", mainController.hb3);
router.get("/hb4", mainController.hb4);

// #6 — Rota /lorem/:n
router.get("/lorem/:n", loremController.lorem);

// Autenticação
router.get("/login", authController.loginPage);
router.post("/login", authController.login);
router.get("/register", authController.registerPage);
router.post("/register", authController.register);
router.get("/logout", authController.logout);

// #16 — Jogo (apenas usuários logados)
router.get("/", isAuthenticated, gameController.index);
router.post("/game-session", isAuthenticated, gameController.saveSession);

// #17 — Ranking (apenas usuários logados)
router.get("/ranking", isAuthenticated, rankingController.index);

export default router;
