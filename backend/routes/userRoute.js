import express from "express";
import { createUser, DeleteUser, getAllUsers, getUser, getUserByEmail, updateUser, updateAddress } from "../controllers/userController.js";

const userRoute = express.Router();

userRoute.post("/", createUser)
userRoute.get("/", getAllUsers)
userRoute.get("/:id", getUser)
userRoute.delete("/:id", DeleteUser)
userRoute.get("/email/:email", getUserByEmail)
userRoute.put("/:id", updateUser)
userRoute.put("/address/:id", updateAddress)
export default userRoute;