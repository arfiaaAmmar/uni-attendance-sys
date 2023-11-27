import { ENDPOINTS } from 'shared-library/src/constants.js';
import { Student } from "shared-library/src/types.js";
import { API_BASE_URL } from "../utils/constants";

export const registerStudent = async (studentForm: Omit<Student, "studentId">) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.registerAdmin}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: studentForm.name,
        email: studentForm.email,
        phone: studentForm.phone,
        course: studentForm.course
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    return response.json;
  } catch (error) {
    throw (error as Error).message;
  }
};


export const getStudent = async (studentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-student/${studentId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()

    if (!response.ok){
      const error = data.error || "An error occured"
      throw new Error(error)
    }

    return data

  } catch (error) {
    throw (error as Error).message
  }
}

export const getAllStudents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.getAllStudents}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      const error = data.error || "An error occured";
      throw new Error(error);
    }

    return data;
  } catch (error) {
    throw (error as Error).message
  }
};




