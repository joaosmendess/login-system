import { Router } from "express";
import {
  home,
  register,
  registerController,
  login,
  loginConttroller,
  logout,
} from "../controllers/AuthControllers";

const router = Router();

router.get("/", home);
router.get("/register", register);
router.get("/login", login);
router.post("/auth/register", registerController);
router.post("/auth/login", loginConttroller);
router.get("/logout", logout);

export default router;
