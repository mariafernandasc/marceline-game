import prisma from "../utils/prisma.js";
import { type Request, type Response } from "express";
import bcrypt from "bcrypt";


// GET /login
const loginPage = async (req: Request, res: Response) => {
  if (req.session?.userId) {
    res.redirect("/");
    return;
  }
  const majors = await prisma.major.findMany({ orderBy: { name: "asc" } });
  res.render("auth/login", { layout: "main", majors });
};

// POST /login
const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const majors = await prisma.major.findMany({ orderBy: { name: "asc" } });
    res.render("auth/login", {
      layout: "main",
      majors,
      error: "Email ou senha inválidos.",
    });
    return;
  }

  req.session.userId   = user.id;
  req.session.fullname = user.fullname;
  res.redirect("/");
};

// GET /register
const registerPage = async (req: Request, res: Response) => {
  if (req.session?.userId) {
    res.redirect("/");
    return;
  }
  const majors = await prisma.major.findMany({ orderBy: { name: "asc" } });
  res.render("auth/register", { layout: "main", majors });
};

// POST /register
const register = async (req: Request, res: Response) => {
  const { fullname, email, password, confirmPassword, majorId } = req.body;
  const majors = await prisma.major.findMany({ orderBy: { name: "asc" } });

  if (password !== confirmPassword) {
    res.render("auth/register", {
      layout: "main",
      majors,
      error: "As senhas não coincidem.",
    });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.render("auth/register", {
      layout: "main",
      majors,
      error: "Este email já está cadastrado.",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { fullname, email, password: hashedPassword, majorId },
  });

  res.redirect("/login");
};

// GET /logout
const logout = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

export default { loginPage, login, registerPage, register, logout };
