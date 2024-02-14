import { updateClassRecord } from "@api/class-record-api";
import { registerStudent } from "@api/student-api";
import { Attendance, ClassRecord, Courses } from "shared-library/dist/types";
import * as XLSX from "xlsx";

/**
 * Handles the upload of an Excel file for student registration.
 *
 * @param {File} file - The Excel file containing student registration data.
 * @returns {void}
 */
export function studentRegisterExcelUpload (
  file: File | undefined
) {
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
 * Handles the upload of an Excel file for class record i.e attendance, class info.
 * @param {string} classId - The ID of the class for which attendance is being uploaded.
 * @param {File} file - The Excel file containing attendance data.
 * @returns {void}
 */
export function classRecordExcelUpload(
  classId: string | undefined,
  file: File | undefined
) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = e.target?.result as string;
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

    // Find the index of "Class Details" row
    const classDetailsRowIndex = excelData.findIndex(row => row.includes("Class Details"));
    if (classDetailsRowIndex === -1) {
      console.error("Class Details row not found in the Excel sheet.");
      return;
    }

    // Extract class details from the "Class Details" row
    const classDetailsRow = excelData[classDetailsRowIndex + 1]; // Next row after "Class Details"
    const classDetails: Partial<ClassRecord> = {}; // Define classDetails as a partial object to allow missing properties

    // Iterate over the columns and populate classDetails
    classDetailsRow.forEach((value, index) => {
      const property = excelData[0][index]; // First row contains property names
      if (typeof property === 'string' && value !== undefined) {
        classDetails[property as keyof ClassRecord] = value;
      }
    });

    excelData.splice(classDetailsRowIndex, 2);

    // Now excelData contains only student attendance data

    // Process the excelData to register students
    excelData.forEach((row) => {
      const attendance: Partial<ClassRecord> = {}; // Define attendance as a partial object to allow missing properties
      // Assuming the columns in the Excel file correspond to properties of ClassRecord
      row.forEach((value, index) => {
        const property = excelData[0][index]; // First row contains property names
        if (property && value !== undefined) {
          attendance[property as keyof ClassRecord] = value;
        }
      });
      // Register student using the API or relevant function
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


/**
 * To upload students attendance list for class session
 * @param {string} classId
 * @param {File} file
 * @return {*} 
 */
export function attendanceListExcelUpload (
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
      const excelData = XLSX.utils.sheet_to_json(worksheet) as Attendance[];

      excelData.forEach((row) => {
        const attendance = row
        updateClassRecord(classId, {attendance: [{...attendance}]}) // TODO not the best solution bcause only sending one student in array
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