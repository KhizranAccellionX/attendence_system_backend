import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import AttendanceRecordSchema from "../models/checkIn";

export const checkOut = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
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
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
    };

    // Extract user ID from the decoded token
    const userId = decodedToken.userId;

    // Find the latest check-in record for the user
    const existingCheckInRecord = await AttendanceRecordSchema.findOne({
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
    await existingCheckInRecord.save();

    res
      .status(200)
      .json({ success: true, message: "Check-out recorded successfully" });
  } catch (error) {
    console.error("Check-out failed:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// import { Request, Response } from "express";
// import AttendanceRecordSchema from "../models/checkIn";
// import { authenticateUser } from "./middleware/AuthMiddelware";

// export const checkOut = async (req: Request, res: Response): Promise<void> => {
//   try {
//     // Access user ID and check-in record date from the request object set by the middleware
//     const { userId, date } = req.user;

//     // Find the latest check-in record for the user and the specified date
//     const existingCheckInRecord = await AttendanceRecordSchema.findOne({
//       user: userId,
//       date: { $gte: new Date().setHours(0, 0, 0, 0) },
//     });

//     if (!existingCheckInRecord) {
//       res.status(400).json({
//         success: false,
//         message: "No check-in record found for today",
//       });
//       return; // Return void after sending the response
//     }
//     console.log(existingCheckInRecord);
//     // Get the current time for check-out
//     const checkOutTime = new Date();

//     // Update the existing check-in record with check-out time and calculate working hours
//     existingCheckInRecord.time_out = checkOutTime;
//     existingCheckInRecord.working_hours =
//       (checkOutTime.getTime() - existingCheckInRecord.time_in.getTime()) /
//       (1000 * 60 * 60); // Calculate working hours in hours

//     // Save the updated check-in record
//     await existingCheckInRecord.save();

//     res
//       .status(200)
//       .json({ success: true, message: "Check-out recorded successfully" });
//   } catch (error) {
//     console.error("Check-out failed:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };
// export const checkOutWithAuth = [authenticateUser, checkOut];
