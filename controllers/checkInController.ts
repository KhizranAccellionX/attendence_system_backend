// import { Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import AttendanceRecordSchema from "../models/checkIn";

// export const checkIn = async (req: Request, res: Response): Promise<void> => {
//   const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
//   const checkInTime = new Date(); // Get the current time for check-in

//   if (!token) {
//     res.status(401).json({ success: false, message: "No token provided" });
//     return; // Return void after sending the response
//   }

//   try {
//     if (!process.env.JWT_SECRET) {
//       throw new Error("JWT_SECRET environment variable is not defined");
//     }

//     // Decode the token to access the claims
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as {
//       userId: string;
//     };

//     // Extract user ID from the decoded token
//     const userId = decodedToken.userId;

//     const existingCheckInRecord = await AttendanceRecordSchema.findOne({
//       user: userId,
//       date: { $gte: new Date().setHours(0, 0, 0, 0) }, // Check for today's date
//     });

//     if (existingCheckInRecord) {
//       res
//         .status(400)
//         .json({ success: false, message: "You have already checked in today" });
//       return; // Return void after sending the response
//     }

//     // Create a new AttendanceRecord document
//     const attendanceRecord = new AttendanceRecordSchema({
//       user: userId,
//       time_in: checkInTime,
//       date: checkInTime,
//       status: "Present", // Assuming user is present at check-in
//     });

//     // Save the new AttendanceRecord document to the database
//     await attendanceRecord.save();

//     res
//       .status(201)
//       .json({ success: true, checkedIn: true,  message: "Check-in recorded successfully" });
//   } catch (error) {
//     console.error("Check-in failed:", error);
//     res.status(500).json({ success: false, checkedIn: false, message: "Internal server error" });
//   }
// };
import { Request, Response } from "express";
import AttendanceRecordSchema from "../models/checkIn";

export const checkIn = async (req: Request, res: Response): Promise<void> => {
  const checkInTime = new Date();
  const date = new Date().setUTCHours(0, 0, 0, 0); // Set the date to midnight in UTC timezone

  console.log("todays date", new Date(date));
  console.log("checkIn time", checkInTime);
  try {
    const userId = req.user._id;
    console.log(userId);
    const existingCheckInRecord = await AttendanceRecordSchema.findOne({
      user: userId,
      date: date,
    });

    if (existingCheckInRecord) {
      res.status(201).json({
        success: false,
        checkedIn: false,
        message: "You have already checked in today",
      });
      return;
    }
    console.log("Existing Check-in Record:", existingCheckInRecord);
    const attendanceRecord = new AttendanceRecordSchema({
      user: userId,
      time_in: checkInTime,
      date: date,
      status: "Present",
    });
    await attendanceRecord.save();

    res.status(201).json({
      success: true,
      checkedIn: true,
      message: "Check-in recorded successfully",
    });
  } catch (error) {
    console.error("Check-in failed:", error);
    res.status(500).json({
      success: false,
      checkedIn: false,
      message: "Internal server error",
    });
  }
};
