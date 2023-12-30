import { API_BASE_URL, ENDPOINT, FM } from "packages/shared-library/src/constants";
import { Student } from "packages/shared-library/src/types";

export const registerStudent = async (studentForm: Omit<Student, "studentId">) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINT.registerAdmin}`, {
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINT.getStudent.replace(':studentId', studentId)}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()

    if (!response.ok) {
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINT.getAllStudents}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      const error = data.error || FM.default;
      throw new Error(error);
    }

    return data;
  } catch (error) {
    throw (error as Error).message
  }
};

export const queryStudents = async (query: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINT.queryStudentDB.replace("${value}", query)}`, {
      headers: { "Content-Type": "application/json" }
    })
    const data = await response.json()

    if (!response.ok) {
      const error = data.error || FM.default
      throw new Error(error)
    }
    return data
  } catch (error) {
    throw (error as Error).message
  }
}




