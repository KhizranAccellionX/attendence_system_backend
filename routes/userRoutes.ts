import express, { Router } from "express";
import { authUser, createUser } from "../controllers/userController";
import { checkIn } from "../controllers/checkInController";
import { getUserDetails } from "../controllers/userDetails";
import { checkOut } from "../controllers/checkOutController";
import { getAllUsers } from "../controllers/fetchUsersController";
import { authenticateUser } from "../controllers/middleware/AuthMiddelware";

const router: Router = express.Router();

router.post("/login", authUser);

router.use(authenticateUser);

router.post("/users", createUser);

router.post("/attendance/check-in", checkIn);
router.post("/attendance/check-out", checkOut);

router.get("/userDetails", getUserDetails);

router.get("/fetchusers", getAllUsers);

export default router;
