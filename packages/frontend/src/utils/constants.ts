import { getUserSessionData } from "@api/admin-api";
import { generateClassId } from "shared-library/dist/shared-helpers";
import { Attendance, ClassRecord, Student } from "shared-library/dist/types";

export const dateTimeFormatForClassRecord = () => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-GB");
  const formattedTime = now.toLocaleTimeString("en-US", { hour12: false });
  return `${formattedDate}-${formattedTime}`;
};

export const formatTime = (date: Date): string => {
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes();
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

  return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
};

/**
 * Format ISOString format to hh:mm AM/PM
 *
 * @param {string} dateObj
 * @return {*}  {string}
 */
export const formatTo12HourTime = (date: string) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
};

// For initialising state hooks value

export const defFeedbackState = {
  success: '',
  error: ''
}

export const defClassSessionState: ClassRecord = {
  classId: "",
  lecturer: getUserSessionData()?.name,
  classroom: 'Classroom 1',
  course: 'Information Technology',
  date: undefined,
  status: "Not started",
}

export const defStudentState: Student = {
  email: '',
  name: '',
  phone: '',
  studentId: '',
}

export const defAttendanceState: Attendance = {
  studentId: "",
  studentName: "",
  attendanceTime: "",
}

export const defAttendanceFormState: Attendance = {
  studentId: "",
  studentName: "",
  attendanceTime: new Date().toISOString()
}