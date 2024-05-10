"use strict";
// import { Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import AttendanceRecordSchema from "../models/checkIn";
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
const checkIn_1 = __importDefault(require("../models/checkIn"));
const checkIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const checkInTime = new Date();
    try {
        const userId = req.user._id;
        console.log(userId);
        const existingCheckInRecord = yield checkIn_1.default.findOne({
            user: userId,
            date: { $gte: new Date().setHours(0, 0, 0, 0) },
        });
        if (existingCheckInRecord) {
            res.status(400).json({
                success: false,
                checkedIn: false,
                message: "You have already checked in today",
            });
            return;
        }
        console.log("Existing Check-in Record:", existingCheckInRecord);
        const attendanceRecord = new checkIn_1.default({
            user: userId,
            time_in: checkInTime,
            date: checkInTime,
            status: "Present",
        });
        yield attendanceRecord.save();
        res.status(201).json({
            success: true,
            checkedIn: true,
            message: "Check-in recorded successfully",
        });
    }
    catch (error) {
        console.error("Check-in failed:", error);
        res.status(500).json({
            success: false,
            checkedIn: false,
            message: "Internal server error",
        });
    }
});
exports.checkIn = checkIn;
