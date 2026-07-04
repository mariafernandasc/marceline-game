// Estende o tipo da sessão do express-session para incluir os campos do usuário
import "express-session";

declare module "express-session" {
  interface SessionData {
    userId:   string;
    fullname: string;
  }
}
