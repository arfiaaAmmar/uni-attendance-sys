export type CollegeCourses =
  | "Food & Beverage"
  | "Information Technology"
  | "Security"
  | "Secretary";
export type Classrooms = "Classroom 1" | "Classroom 2" | "Classroom 3";

//Student DB
export type Admin = {
  _id: string;
  email: string;
  name: string;
  password?: string;
  phone: number;
};

export type Student = {
  studentId: string;
  name: string;
  email: string;
  phone: string;
  course: string;
};

//Class Session / Class History
export type StudentAttendance = {
  studentName: string;
  studentId: string;
  attendanceTime: string;
};

export type ClassRecord = {
  classId: string;
  lecturer: string | null;
  classroom: Classrooms | string;
  course: CollegeCourses | string;
  date: string;
  startTime: string;
  endTime: string;
  attendance?: StudentAttendance[];
};
