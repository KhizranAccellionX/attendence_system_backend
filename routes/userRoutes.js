"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const checkInController_1 = require("../controllers/checkInController");
const userDetails_1 = require("../controllers/userDetails");
const checkOutController_1 = require("../controllers/checkOutController");
const fetchUsersController_1 = require("../controllers/fetchUsersController");
const AuthMiddelware_1 = require("../controllers/middleware/AuthMiddelware");
const userAttendence_1 = require("../controllers/userAttendence");
const router = express_1.default.Router();
router.post("/login", userController_1.authUser);
router.use(AuthMiddelware_1.authenticateUser);
router.post("/users", userController_1.createUser);
router.post("/attendance/check-in", checkInController_1.checkIn);
router.post("/attendance/check-out", checkOutController_1.checkOut);
router.get("/userDetails", userDetails_1.getUserDetails);
router.get("/fetchusers", fetchUsersController_1.getAllUsers);
router.get("/userattendance", userAttendence_1.getUserAttendance);
exports.default = router;
