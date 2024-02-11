import { Schema, Types, model } from "mongoose";
import { IAdminModel, IClassRecordModel, IScannerRecordModel, IStudentModel } from "shared-library/dist/types"

const DB_COLLECTIONS = {
  admin: "Admin",
  student: "Student",
  classRecord: "Class Record",
  scannerAttendance: "Scanner Attendance",
}

// Lecturers are admins
const adminSchema = new Schema<IAdminModel>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
});

const studentSchema = new Schema<IStudentModel>({
  studentId: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  course: { type: String, required: true },
  scannerId: { type: String, required: false }, // TODO: Create UI to change/add scannerId after register
});

const classRecord = new Schema<IClassRecordModel>({
  classId: { type: String, required: true },
  lecturer: { type: String, required: true },
  course: { type: String, required: true },
  classroom: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  attendance: [
    {
      studentId: { type: String, required: true },
      studentName: { type: String, required: true },
      attendanceTime: { type: String, required: true },
    },
  ],
});

const scannerRecord = new Schema<IScannerRecordModel>({
  studentName: { type: String, required: true },
  attendanceId: { type: Number, required: true },
  attendanceTime: { type: String, required: true },
})

export const AdminModel = model<IAdminModel>(DB_COLLECTIONS.admin, adminSchema);
export const StudentModel = model<IStudentModel>(DB_COLLECTIONS.student, studentSchema);
export const ClassRecordModel = model<IClassRecordModel>(DB_COLLECTIONS.classRecord,
  classRecord
);
export const ScannerRecordModel = model<IScannerRecordModel>(DB_COLLECTIONS.scannerAttendance,
  scannerRecord
)