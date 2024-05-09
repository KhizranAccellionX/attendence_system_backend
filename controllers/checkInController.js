"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkIn_1 = __importDefault(require("../models/checkIn"));
const checkIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // Extract token from Authorization header
    const checkInTime = new Date(); // Get the current time for check-in
    if (!token) {
        res.status(401).json({ success: false, message: "No token provided" });
        return; // Return void after sending the response
    }
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET environment variable is not defined");
        }
        // Decode the token to access the claims
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Extract user ID from the decoded token
        const userId = decodedToken.userId;
        const existingCheckInRecord = yield checkIn_1.default.findOne({
            user: userId,
            date: { $gte: new Date().setHours(0, 0, 0, 0) }, // Check for today's date
        });
        if (existingCheckInRecord) {
            res
                .status(400)
                .json({ success: false, message: "You have already checked in today" });
            return; // Return void after sending the response
        }
        // Create a new AttendanceRecord document
        const attendanceRecord = new checkIn_1.default({
            user: userId,
            time_in: checkInTime,
            date: checkInTime,
            status: "Present", // Assuming user is present at check-in
        });
        // Save the new AttendanceRecord document to the database
        yield attendanceRecord.save();
        res
            .status(201)
            .json({ success: true, message: "Check-in recorded successfully" });
    }
    catch (error) {
        console.error("Check-in failed:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.checkIn = checkIn;
