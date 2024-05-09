import mongoose, { Schema, Document } from "mongoose";

interface IAttendanceRecord extends Document {
  user: string;
  time_in: Date;
  time_out?: Date;
  working_hours?: number,
  status: string;
}

const attendanceRecordSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  time_in: { type: Date, required: true },
  time_out: { type: Date },
  working_hours: {type: Number},
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late", "Excused"],
    default: "Present",
  },
});

export default mongoose.model<IAttendanceRecord>(
  "AttendanceRecord",
  attendanceRecordSchema
);
