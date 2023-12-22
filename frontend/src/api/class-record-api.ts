
import { handleAPIRequest } from "@helpers/handlers";
import { API, API_BASE_URL } from "@shared-library/constants";
import { ClassRecord, HandleDeleteType, StudentAttendance } from "@shared-library/types";

export const postClassRecord = async <T>(classData: T) => {
  return handleAPIRequest<T>(
    `${API_BASE_URL}${API.postClassRecord}`,
    "POST",
    classData
  );
};

export const postAttendance = async (
  _id: string,
  attendanceData: StudentAttendance
) => {
  return handleAPIRequest<void>(
    `${API_BASE_URL}${API.postAttendance.replace(":classId", _id)}`,
    "POST",
    attendanceData
  );
};

export const getClassRecord = async (_id: string) => {
  return handleAPIRequest<ClassRecord>(
    `${API_BASE_URL}${API.getClassRecord.replace(":classId", _id)}`,
    "GET"
  );
};

export const updateClassRecord = async (_id: string, data: ClassRecord) => {
  return handleAPIRequest<ClassRecord>(
    `${API_BASE_URL}${API.updateClassRecord.replace(":classId", _id)}`,
    "PUT",
    data
  );
};

export const getAllClassRecords = async () => {
  return handleAPIRequest<any[]>(
    `${API_BASE_URL}${API.getAllClassRecords}`,
    "GET"
  );
};

export const getLiveClassRecords = async () => {
  return handleAPIRequest<any[]>(
    `${API_BASE_URL}${API.getLiveClassSessions}`,
    "GET"
  );
};

export const handleDelete = async (id: string, type: HandleDeleteType) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete-${type}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) console.log(`${type} with ID ${id} deleted successfully.`)
    else console.error(`Failed to delete ${type} with ID ${id}.`);
  } catch (error) {
    console.error(
      `An error occurred while deleting ${type} with ID ${id}.`,
      error
    );
  }
};
