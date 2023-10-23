import { IClassRecord, IStudentAttendance } from "shared-library/types";

const API_BASE_URL = "http://localhost:8888";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
}

async function handleAPIRequest<T>(
  url: string,
  method: string,
  data?: any
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    // Add any other common headers here
  };

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(data),
    });

    return await handleResponse<T>(response);
  } catch (error) {
    throw (error as Error).message;
  }
}

export const postClassRecord = async <T>(classData: T) => {
  return handleAPIRequest<T>(
    `${API_BASE_URL}/post-class_record`,
    "POST",
    classData
  );
};

export const postAttendance = async (
  classId: string,
  attendanceData: IStudentAttendance
) => {
  return handleAPIRequest<void>(
    `${API_BASE_URL}/post-attendance/${classId}`,
    "POST",
    attendanceData
  );
};

export const getClassRecord = async (_id: string | undefined) => {
  return handleAPIRequest<IClassRecord>(
    `${API_BASE_URL}/get-class-record/${_id}`,
    "GET"
  );
};

export const updateClassRecord = async (
  classId: string,
  data: IClassRecord
) => {
  return handleAPIRequest<IClassRecord>(
    `${API_BASE_URL}/update-class-record/${classId}`,
    "PUT",
    data
  );
};

export const getAllClassRecords = async () => {
  return handleAPIRequest<any[]>(
    `${API_BASE_URL}/get-all-class-records`,
    "GET"
  );
};

export const getLiveClassRecords = async () => {
  return handleAPIRequest<any[]>(
    `${API_BASE_URL}/get-live-class-sessions`,
    "GET"
  );
};

export const handleDelete = async (
  id: string,
  type: "admin" | "student" | "class-record"
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete-${type}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Item successfully deleted from the database
      console.log(`${type} with ID ${id} deleted successfully.`);
    } else {
      // Failed to delete item from the database
      console.error(`Failed to delete ${type} with ID ${id}.`);
    }
  } catch (error) {
    // Handle any errors that occur during the deletion process
    console.error(
      `An error occurred while deleting ${type} with ID ${id}.`,
      error
    );
  }
};
