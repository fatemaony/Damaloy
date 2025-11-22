import express from "express";
import { createUser, DeleteUser, getAllUsers, getUser, getUserByEmail, updateUser } from "../controllers/userController.js";

const userRoute = express.Router();

userRoute.post("/", createUser)
userRoute.get("/", getAllUsers)
userRoute.get("/:id", getUser)
userRoute.get("/:id", DeleteUser)
userRoute.get("/email/:email", getUserByEmail)
userRoute.put("/:id", updateUser)
export default userRoute;