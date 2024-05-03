import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

interface UserAttributes {
  id: number;
  name: string;
  password: string;
  email: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public password!: string;
  public email!: string;

  static readonly tableName = "users";

  // Desativar automaticamente os campos de data e hora
  static readonly timestamps = false;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { sequelize, modelName: "User" }
);

export default User;
