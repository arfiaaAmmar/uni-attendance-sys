import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import { Document } from "mongoose";

export type Courses =
  | "Food & Beverage"
  | "Information Technology"
  | "Security"
  | "Secretary";
export type Classrooms = "Classroom 1" | "Classroom 2" | "Classroom 3";
export type HandleDeleteType = "admin" | "student" | "class-record";
export type ClassStatus = "Not started" | "Ongoing" | "Ended"

export type FeedbackProps = {
  success: string;
  error: string;
};

export type HttpMethod = "POST" | "GET" | "PUT" | "PATCH" | "DELETE"

export type Admin = {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
};

export type Student = {
  studentId: string;
  name: string;
  email: string;
  phone: string;
  course?: Courses;
  scannerId?: number;
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
  classroom: Classrooms;
  course: Courses;
  status: ClassStatus;
  date?: string;
  startTime?: string;
  endTime?: string;
  attendance?: Attendance[];
};

export type ClassDetails = Omit<ClassRecord, "_id, attendance">

export type ScannerRecord = {
  studentName: string;
  attendanceId: number;
  attendanceTime: string;
}

// For Backend MongoDB model Types
export type IAdminModel = Admin & Document;
export type IStudentModel = Student & Document;
export type IClassRecordModel = ClassRecord & Document;
export type IScannerRecordModel = ScannerRecord & Document;

export type ModalActivationProps = {
  isActive: boolean;
  setIsActive: Dispatch<SetStateAction<boolean>>;
};