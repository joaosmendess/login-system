import { Sequelize } from "sequelize";
import dotenv from "dotenv";

import path from "path";

dotenv.config({ path: path.join(__dirname, "../../src/.env") });

const sequelize = new Sequelize({
  database: process.env.DB_NAME as string,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  host: process.env.DB_HOST as string,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  dialect: "mysql",
});

export default sequelize;
