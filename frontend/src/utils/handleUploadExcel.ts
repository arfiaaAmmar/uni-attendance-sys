import * as XLSX from 'xlsx'; 
import { registerStudent } from '../api/studentDbApi';

export const handleUploadExcel = (file: File | undefined) => {
  
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result as string;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet
        const worksheet = workbook.Sheets[sheetName];
        
        const excelData = XLSX.utils.sheet_to_json(worksheet) as Array<{
          email: string;
          name: string;
          phone: string;
          course: string;
        }>;
        console.log('Excel Data:', excelData);

        // Process the excelData to register students
        excelData.forEach((row) => {
          const { email, name, phone, course } = row;
          // Register student using the API or relevant function
          // Note: You need to define your registerStudent function appropriately
          registerStudent({ email, name, phone, course })
            .then(() => {
              console.log('Student registered:', row);
            })
            .catch((error) => {
              console.error('Error registering student:', error);
            });
        });
      };
      reader.readAsBinaryString(file);
    }
}