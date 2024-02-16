import { postClassRecord, updateClassRecord } from "@api/class-record-api";
import { registerStudent } from "@api/student-api";
import { Attendance, ClassDetails, ClassRecord, ClassStatus, Classrooms, Courses, Student } from "shared-library/dist/types";
import * as XLSX from "xlsx";

/**
 * Handles the upload of an Excel file for student registration.
 *
 * @param {File} file - The Excel file containing student registration data.
 * @returns {void}
 */
export function handleStudentRegisterExcelUpload(
  file: File | undefined
) {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const excelData = XLSX.utils.sheet_to_json(worksheet) as Omit<Student, "studentId">[]

      // Process the excelData to register students
      excelData.forEach((row) => {
        const { email, name, phone, course } = row;
        registerStudent({ email, name, phone, course })
          .then(() => {
            console.log("Student registered:", row);
          })
          .catch((error) => {
            console.error("Error registering student:", error);
          });
      });
    };
    reader.readAsBinaryString(file);
  }
};

/**
 * Handles the upload of an Excel file for class record i.e attendance, class info.
 * @param {string} classId - The ID of the class for which attendance is being uploaded.
 * @param {File} file - The Excel file containing attendance data.
 * @returns {void}
 */
// TODO Try follow the ~/assets/All Report.xls format
export function handleClassRecordExcelUpload(classId: string, file: File, type?: "patch" | "post") {
  if (!file || !classId) return;

  const reader = new FileReader();
  reader.onload = e => {
    const data = e.target?.result as string;
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    let classDetails: ClassDetails | null = null
    let attendanceList: Attendance[] = []

    const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

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
      console.log("Class Details:", classDetails);
    }

    // Find Attendances table
    const attendanceHeaderRow = excelData.findIndex(row => row.includes("Attendance"));
    if (attendanceHeaderRow !== -1) {
      const attendanceTable = excelData.slice(attendanceHeaderRow + 1) // Get rows below "Attendance"
      attendanceTable.map(row => {
        const attendanceObj: { [key: string]: string } = {}; // Object to hold attendance data for each student
        row.forEach((value, index) => {
          attendanceObj[index] = value; // Assign data as usual
        });
        return attendanceObj;
      });
      console.log("Attendances:", attendanceList);
    }

    if (!classDetails || !attendanceList) return
    const { classId, classroom, lecturer, course, status, date, startTime, endTime } = classDetails
    const params: ClassRecord = {
      classId,
      classroom,
      lecturer,
      course,
      status,
      date,
      startTime,
      endTime,
      attendance: attendanceList
    }

    if (!type || type === "post") {
      postClassRecord(params)
        .then(() => {
          console.log("Class Record registered", params);
        })
        .catch((error) => {
          console.error("Error registering class record:", error);
        });
    } else {
      updateClassRecord(classId, params)
        .then(() => {
          console.log("Class Record registered", params);
        })
        .catch((error) => {
          console.error("Error registering class record:", error);
        });
    }

  };
  reader.readAsBinaryString(file);
}

/**
 * To upload students attendance list for class session
 * @param {string} classId
 * @param {File} file
 * @return {*}
 */
// TODO Will separate attendance from classRecordExcelUpload
// export function attendanceListExcelUpload (
//   classId: string,
//   file: File | undefined
// ) {
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = e.target?.result as string;
//       const workbook = XLSX.read(data, { type: "binary" });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const excelData = XLSX.utils.sheet_to_json(worksheet) ;

//       excelData.forEach((row) => {
//         const attendance = row
//         updateClassRecord(classId, {attendance: [{...attendance}]}) // TODO not the best solution bcause only sending one student in array
//           .then(() => {
//             console.log("Student registered:", row);
//           })
//           .catch((error) => {
//             console.error("Error registering student:", error);
//           });
//       });
//     };
//     reader.readAsBinaryString(file);
//   }
// };

// TODO Try follow the ~/assets/All Report.xls format
export function handleClassRecordAttendanceExcelUpload(
  classId: string,
  file: File | undefined
) {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const newAttendance: Attendance[] = []
      const excelData = XLSX.utils.sheet_to_json(worksheet) as Attendance[]

      // Process the excelData to register students
      excelData.forEach((row) => {
        newAttendance.push(row)
        updateClassRecord(classId, { attendance: newAttendance })
          .then(() => {
            console.log("Attendance(s) added:", row);
          })
          .catch((error) => {
            console.error("Error adding attendance(s):", error);
          });
      });
    };
    reader.readAsBinaryString(file);
  }
};