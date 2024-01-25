import { Schema, model } from "mongoose";
import { IAdminModel, IClassRecordModel, IScannerRecordModel, IStudentModel } from "@shared-library/types"

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
  attendanceScannerId: { type: String }
});

export const StudentModel = model<IStudentModel>("Student", studentSchema);

const classRecord = new Schema<IClassRecordModel>({
  classId: { type: String, required: true },
  lecturer: { type: String, required: true },
  lecturerEmail: { type: String, required: true },
  course: { type: String, required: true },
  classroom: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  attendance: [
    {
      studentName: { type: String, required: true },
      studentId: { type: String, required: true },
      attendanceTime: { type: String, required: true },
    },
  ],
});

export const ClassRecordModel = model<IClassRecordModel>(
  "Class Record",
  classRecord
);

const scannerRecord = new Schema<IScannerRecordModel>({
  studentName: { type: String, required: true },
  attendanceId: { type: Number, required: true },
  attendanceTime: { type: String, required: true },
})

export const ScannerRecordModel = model<IScannerRecordModel>(
  "Scanner Attendance",
  scannerRecord
)
