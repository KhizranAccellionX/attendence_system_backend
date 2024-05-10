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
const router = express_1.default.Router();
router.post("/users", userController_1.createUser);
router.post("/login", userController_1.authUser);
router.post("/attendance/check-in", checkInController_1.checkIn);
router.post("/attendance/check-out", checkOutController_1.checkOut);
router.get("/userDetails", userDetails_1.getUserDetails);
exports.default = router;
