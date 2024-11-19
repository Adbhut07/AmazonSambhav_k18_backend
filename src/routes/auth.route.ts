import express from "express";
import { deleteUser, getUserById, loginUser, registerUser, updateUser } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);
router.get("/:id", getUserById);

export default router;
