import { Dispatch } from 'react'
import { SetStateAction } from 'react'
import { Document } from "mongoose";

export type Courses =
  | "Food & Beverage"
  | "Information Technology"
  | "Security"
  | "Secretary";
export type Classrooms = "Classroom 1" | "Classroom 2" | "Classroom 3";
export type HandleDeleteType = "admin" | "student" | "class-record";
export type ClassStatus = "Not started" | "Ongoing" | "Ended"

export type Feedback = {
  success: string;
  error: string;
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
  attendanceScannerId?: number;
};

export type Attendance = {
  studentName: string;
  studentId: string;
  attendanceTime: string;
};

export type ClassRecord = {
  _id?: string;
  classId: string;
  lecturer: string;
  lecturerEmail: string;
  classroom: Classrooms;
  course: Courses;
  date?: string;
  status: ClassStatus;
  startTime?: string;
  endTime?: string;
  attendance?: Attendance[];
};

export type ScannerRecord = {
  _id?: string;
  attendanceId: number;
  studentName: string;
  attendanceTime: string;
}

// Define the User interface
export type IAdminModel = Admin & Document;
export type IStudentModel = Student & Document;
export type IClassRecordModel = ClassRecord & Document;
export type IScannerRecordModel = ScannerRecord & Document;

export type ModalActivationProps = {
  isActive: boolean;
  setIsActive: Dispatch<SetStateAction<boolean>>;
};