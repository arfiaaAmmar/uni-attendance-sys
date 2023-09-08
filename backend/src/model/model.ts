import { Schema, Document, model } from "mongoose";
import { IAdmin, IClassRecord, IStudent } from "../../../shared-library/types";

// Define the User interface
type IAdminModel = IAdmin & Document;
type IStudentModel = IStudent & Document;
type IClassRecordModel = IClassRecord & Document;

// Define the User schema
const adminSchema = new Schema<IAdminModel>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
});

export const AdminModel = model<IAdminModel>("Admin", adminSchema);

const studentSchema = new Schema<IStudentModel>({
  studentId: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  course: { type: String, required: true },
});

export const StudentModel = model<IStudentModel>("Student", studentSchema);

const classRecord = new Schema<IClassRecordModel>({
  lecturer: { type: String, required: true },
  course: { type: String, required: true },
  classroom: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  attendance: [
    {
      studentName: { type: String },
      studentId: { type: String },
      attendanceTime: { type: String },
    },
  ],
});

export const ClassRecordModel = model<IClassRecordModel>(
  "Class Record",
  classRecord
);
