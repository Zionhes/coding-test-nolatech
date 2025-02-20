import { Router } from "express";
import { registerUser, loginUser, refreshToken, logoutUser } from "./auth.controller";
import { registerSchema, loginSchema, refreshTokenSchema } from "./schemas";
import validateRequest from "../../middlewares/validateRequest";
import { authenticateToken, authorizeRoles } from "../../middlewares/authorizedRoles";
import { User, UserSchema } from "../../models/user.model";

const router = Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);
router.get("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.get("/", (_req, res) => {
  res.json({ message: "auth endpoint working!" });
});

router.get("/users", authenticateToken, authorizeRoles("admin"), async (_req, res) => {
  const users = await User.find({}, { password: 0 });
  res.json(users);
});

export default router;
