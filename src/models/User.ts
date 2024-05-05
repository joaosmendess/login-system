import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/sequelize";

interface UserAttributes {
  id: number;
  name: string;
  password: string;
  email: string;
}
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public name!: string;
  public password!: string;
  public email!: string;

  public readonly timestamps = false;
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
  { sequelize, modelName: "User", tableName: "users", timestamps: false }
);

export default User;
