import { postClassRecord, updateClassRecord } from "@api/class-record-api";
import { Attendance, ClassDetails, ClassRecord, ClassStatus, Classrooms, Courses, Student } from "shared-library/dist/types";
import { read, utils } from "xlsx";

/**
 * Parses the excel file for student registration.
 *
 * @param {File} file - The Excel file containing student registration data.
 * @returns {void}
 */
export async function parseStudentRegisterFile(file: File | undefined): Promise<Omit<Student, "studentId">[] | null> {
  return new Promise((resolve, reject) => {
    if (!file) resolve(null);
    else {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          const workbook = read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const excelData = utils.sheet_to_json(worksheet) as Omit<Student, "studentId">[];
          resolve(excelData);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsBinaryString(file);
    }
  });
};

/**
 * Handles the upload of an Excel file for class record i.e attendance, class info.
 * @param {string} classId - The ID of the class for which attendance is being uploaded.
 * @param {File} file - The Excel file containing attendance data.
 * @returns {void}
 */
export function parseClassRecordFile(classId: string, file: File): Promise<ClassRecord | null> {
  return new Promise((resolve, reject) => {
    if (!file || !classId) resolve(null);
    else {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const data = e.target?.result as string;
          const workbook = read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          let classDetails: ClassDetails | null = null;
          let attendanceList: Attendance[] = [];

          const excelData = utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

          // Find Class Details table
          const classDetailsRow = excelData.findIndex(row => row.includes("Class Details"));
          if (classDetailsRow !== -1) {
            const classDetailsTable = excelData.slice(classDetailsRow + 1); // Get rows below "Class Details"
            classDetails = {
              classId: classDetailsTable[0][1],
              lecturer: classDetailsTable[1][1],
              classroom: classDetailsTable[2][1] as Classrooms,
              course: classDetailsTable[3][1] as Courses,
              status: classDetailsTable[4][1] as ClassStatus,
              date: classDetailsTable[5][1],
              startTime: classDetailsTable[6][1],
              endTime: classDetailsTable[7][1]
            };
          }

          // Find Attendances table
          const attendanceHeaderRow = excelData.findIndex(row => row.includes("Attendance"));
          if (attendanceHeaderRow !== -1) {
            const attendanceTable = excelData.slice(attendanceHeaderRow + 1); // Get rows below "Attendance"
            attendanceTable.forEach(row => {
              const attendanceObj: Attendance = {
                studentName: row[0],
                studentId: row[1],
                attendanceTime: row[1]
              };
              attendanceList.push(attendanceObj);
            });
          }

          if (!classDetails || attendanceList.length === 0) {
            resolve(null);
          } else {
            const excelData: ClassRecord = { ...classDetails, attendance: attendanceList};
            resolve(excelData);
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsBinaryString(file);
    }
  });
}

/**
 * Parses student attendance file during class session / class record
 *
 * @param {(File | undefined)} file
 * @return {*}  {(Promise<Attendance[] | null>)}
 */
export function parseStudentAttendanceFile(file: File | undefined): Promise<Attendance[] | null> {
  return new Promise((resolve, reject) => {
    if (!file) resolve(null)
    else {
      const reader = new FileReader()
      reader.onload = e => {
        try {
          const data = e.target?.result as string
          const workbook = read(data, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]

          const excelData = utils.sheet_to_json(worksheet) as Attendance[]
          resolve(excelData);
        } catch (error) {
          reject(error)
        }
      }
      reader.readAsBinaryString(file)
    }
  })
}
