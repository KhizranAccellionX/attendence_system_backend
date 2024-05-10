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
exports.checkOut = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkIn_1 = __importDefault(require("../models/checkIn"));
const checkOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // Extract token from Authorization header
    const checkOutTime = new Date(); // Get the current time for check-out
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
        // Find the latest check-in record for the user
        const existingCheckInRecord = yield checkIn_1.default.findOne({
            user: userId,
            date: { $gte: new Date().setHours(0, 0, 0, 0) }, // Check for today's date
        });
        if (!existingCheckInRecord) {
            res
                .status(400)
                .json({
                success: false,
                message: "No check-in record found for today",
            });
            return; // Return void after sending the response
        }
        // Update the existing check-in record with check-out time and calculate working hours
        existingCheckInRecord.time_out = checkOutTime;
        existingCheckInRecord.working_hours =
            (checkOutTime.getTime() - existingCheckInRecord.time_in.getTime()) /
                (1000 * 60 * 60); // Calculate working hours in hours
        yield existingCheckInRecord.save();
        res
            .status(200)
            .json({ success: true, message: "Check-out recorded successfully" });
    }
    catch (error) {
        console.error("Check-out failed:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.checkOut = checkOut;
