import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/User";

const app = express();

// Configuração da sessão express
app.use(
  session({
    secret: "secretpassword",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // secure: true em produção com HTTPS
  })
);

// Inicialize o Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configuração da estratégia de autenticação local
passport.use(
  new LocalStrategy(async function (email, password, done) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Rota de login
app.get("/login", (req, res) => {
  // Verifique se o usuário já está autenticado
  if (req.isAuthenticated()) {
    return res.redirect("/login-success");
  }
  res.render("login");
});

// Rota de logout
app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/"); // Redireciona para a página inicial após logout
  });
});
// Rota de sucesso de login
app.get("/login-success", (req, res) => {
  res.render("login-success", { user: req.user });
});

export default app;
