import { Router } from "express";

import {
  createUser,
  deleteUser,
  getMyProfile,
  getUserById,
  listUsers,
  updateMyProfile,
  updateUser,
} from "../controllers/UsersController.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";

const usersRouter = Router();

// Require authentication for user management endpoints
usersRouter.use(authenticateToken);

// Authenticated user profile routes
usersRouter.get("/me", getMyProfile);
usersRouter.put("/me", updateMyProfile);

// Only Owner and Admin may manage users
usersRouter.get("/", authorizeRoles("Owner", "Admin"), listUsers);
usersRouter.get("/:userId", authorizeRoles("Owner", "Admin"), getUserById);
usersRouter.post("/", authorizeRoles("Owner", "Admin"), createUser);
usersRouter.put("/:userId", authorizeRoles("Owner", "Admin"), updateUser);
usersRouter.delete("/:userId", authorizeRoles("Owner", "Admin"), deleteUser);

export default usersRouter;
