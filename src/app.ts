import express from "express";
import { engine } from "express-handlebars";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import path from "path";

import User from "./models/User";
import authRoutes from "./routes/AuthRoutes";

const app = express();
const PORT = 3000;

// Configuração da sessão
app.use(
  session({
    secret: "secretpassword",
    resave: false,
    saveUninitialized: false,
  })
);

// Configuração do Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
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
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id as number); // Use type assertion here
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      done(new Error("User not found"), null);
    } else {
      done(null, user);
    }
  } catch (error) {
    done(error);
  }
});

app.engine("handlebars", engine());
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../src/views"));
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);

app.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    // Se o usuário estiver autenticado, redirecione para a página de sucesso de login
    res.redirect("/login-success");
  } else {
    res.render("/");
    try {
      const users = await User.findAll();
      if (users.length === 0) {
        res.status(400).send("Nenhum usuário encontrado no momento.");
      } else {
        res.render("index", { users });
      }
    } catch (error) {
      console.error("Erro ao acessar o banco de dados", error);
      res.status(500).send("Erro ao acessar o banco de dados");
    }
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
function next(err: any): void {
  throw new Error("Function not implemented.");
}
