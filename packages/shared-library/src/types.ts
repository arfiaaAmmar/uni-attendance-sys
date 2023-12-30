import { Document } from "mongoose";

export type Courses =
  | "Food & Beverage"
  | "Information Technology"
  | "Security"
  | "Secretary";
export type Classrooms = "Classroom 1" | "Classroom 2" | "Classroom 3";
export type HandleDeleteType = "admin" | "student" | "class-record";

export type Feedback = {
  success: string;
  error: string | unknown;
};

export type Admin = {
  _id?: string;
  email: string;
  name: string;
  password?: string;
  phone: string;
};

export type Student = {
  studentId: string;
  name: string;
  email: string;
  phone: string;
  course?: Courses;
};

export type StudentAttendance = {
  studentName: string;
  studentId: string;
  attendanceTime: string;
};

export type ClassRecord = {
  _id?:string;
  lecturer: string;
  classroom: Classrooms | string;
  course: Courses | string;
  date: string;
  startTime: string;
  endTime: string;
  attendance?: StudentAttendance[];
};

// Define the User interface
export type IAdminModel = Admin & Document;
export type IStudentModel = Student & Document;
export type IClassRecordModel = ClassRecord & Document;
