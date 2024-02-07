import { ClassRecord, ClassStatus, Classrooms, Courses } from "shared-library/src/types";
import * as XLSX from "xlsx";
import { updateClassRecord } from "../api/class-record-api";
import { registerStudent } from "../api/student-api";

/**
 * Handles the upload of an Excel file for student registration.
 *
 * @param {File} file - The Excel file containing student registration data.
 * @returns {void}
 */
export const handleUploadExcelForStudentRegistration = (
  file: File | undefined
) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0]; 
      const worksheet = workbook.Sheets[sheetName];

      const excelData = XLSX.utils.sheet_to_json(worksheet) as Array<{
        email: string;
        name: string;
        phone: string;
        course: Courses;
      }>;
      console.log("Excel Data:", excelData);

      // Process the excelData to register students
      excelData.forEach((row) => {
        const { email, name, phone, course } = row;
        // Register student using the API or relevant function
        // Note: You need to define your registerStudent function appropriately
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
 * Handles the upload of an Excel file for attendance records.
 *
 * @param {string} classId - The ID of the class for which attendance is being uploaded.
 * @param {File} file - The Excel file containing attendance data.
 * @returns {void}
 */
export const handleUploadExcelForAttendance = (
  classId: string | undefined,
  file: File | undefined
) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet
      const worksheet = workbook.Sheets[sheetName];

      const excelData = XLSX.utils.sheet_to_json(worksheet) as ClassRecord[];
      console.log("Excel Data:", excelData);

      // Process the excelData to register students
      excelData.forEach((row) => {
        const attendance = row;
        // Register student using the API or relevant function
        // Note: You need to define your registerStudent function appropriately
        updateClassRecord(classId!, attendance)
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
