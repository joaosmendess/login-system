import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const home = (req: Request, res: Response) => {
  res.render("index");
};

export const register = (req: Request, res: Response) => {
  res.render("register");
};

export const login = (req: Request, res: Response) => {
  // Verifique se o usuário já está autenticado
  if (req.isAuthenticated()) {
    return res.redirect("/login-sucess");
  }

  res.render("login");
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // Assumindo que você está usando o session cookie padrão
      res.redirect("/login");
    });
  });
};
export const registerController = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const password_confirm = req.body["confirm-password"];
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.render("register", {
        message: "This email is already in use",
      });
    }

    if (password !== password_confirm) {
      return res.render("register", {
        ErrorMessage: "Passwords do not match!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.render("register", { ConfirmMessage: "User registered successfully!" });
  } catch (error) {
    console.log(error);
    res.render("register", {
      ErrorMessage: "Erro no registro do usuario",
    });
  }
};

export const loginConttroller = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ ErrorMessage: "Email ou senha incorretos" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ ErrorMessage: " Email ou senha incorretos" });
    }

    const token = jwt.sign({ userId: user.id }, "secretpassword", {
      expiresIn: "1h",
    });

    res.render("login-sucess", {
      user: { name: user.name, email: user.email },
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
