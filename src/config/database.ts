import mysql from "mysql";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../src/.env") });

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT ?? "3306"),
});

db.connect((error) => {
  if (error) {
    console.error("Erro na conexão do banco de dados:", error);
    return;
  }
  console.log("Conectado ao banco de dados MySQL!");
});

export default db;
