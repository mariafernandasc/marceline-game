import express from "express";
import { engine } from "express-handlebars";
import session from "express-session";
import helpers from "./views/helpers/helpers.js";

import validateEnv from "./utils/validateEnv.js";
import logger from "./middlewares/logger.js";
import router from "./router/router.js";

const env = validateEnv();
const PORT = env.PORT;
const app = express();

app.engine("handlebars", engine({ helpers }));
app.set("view engine", "handlebars");
app.set("views", `${process.cwd()}/src/views`);

app.use(logger("complete"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
}));

// Passa a sessão para todas as views do Handlebars
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use("/img",  express.static(`${process.cwd()}/public/img`));
app.use("/game", express.static(`${process.cwd()}/public/game`));
app.use("/css", [
  express.static(`${process.cwd()}/public/css`),
  express.static(`${process.cwd()}/node_modules/bootstrap/dist/css`),
]);
app.use("/js", [
  express.static(`${process.cwd()}/public/js`),
  express.static(`${process.cwd()}/node_modules/bootstrap/dist/js`),
]);

app.use(router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
