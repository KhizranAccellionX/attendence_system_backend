import express, { Router } from "express";
import { authUser, createUser } from "../controllers/userController";
import { checkIn } from "../controllers/checkInController";
import { getUserDetails } from "../controllers/userDetails";
import { checkOut } from "../controllers/checkOutController";

const router: Router = express.Router();

router.post("/users", createUser);

router.post("/login", authUser);

router.post("/attendance/check-in", checkIn);

router.post("/attendance/check-out", checkOut)

router.get("/userDetails", getUserDetails)
export default router;
