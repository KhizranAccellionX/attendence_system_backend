import express, { Router } from "express";
import { authUser, createUser } from "../controllers/userController";
import { checkIn } from "../controllers/checkInController";
import { getUserDetails } from "../controllers/userDetails";

const router: Router = express.Router();

router.post("/users", createUser);

router.post("/login", authUser);

router.post("/attendance/check-in", checkIn);

router.get("/userDetails", getUserDetails)
export default router;
