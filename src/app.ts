import express from "express";

import User from "./models/User";

const app = express();
const PORT = 3000;

app.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "password", "email"],
    }); //recupera todos os usuários da tabela
    if (users.length === 0) {
      return res.status(400).send("Nenhum usuario encontrado no momento.");
    }
    res.send(`Dados recuperados: ${JSON.stringify(users)}`);
  } catch (error) {
    console.error("Erro ao acessar o banco de dados", error);
    res.status(500).send("error ao acessar o banco de dados");
  }
});

app.listen(PORT, () => {
  console.log(`servidor rodando na porta ${PORT}`);
});
