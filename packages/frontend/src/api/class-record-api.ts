import { handleAPIRequest } from "@helpers/handlers";
import { ENDPOINT, STORAGE_NAME } from "shared-library/dist/constants";
import { ClassRecord, HandleDeleteType, Attendance } from "shared-library/dist/types";
import { API_URL } from "config/config";

/**
 * Posts a class record to the API.
 *
 * @param {ClassRecord} classData - The class record data to be posted.
 * @returns {Promise<ClassRecord>} A promise that resolves to the posted class record.
 */
export const postClassRecord = async (classData: ClassRecord) => {
  return handleAPIRequest<ClassRecord>(
    `${API_URL}${ENDPOINT.postClassRecord}`,
    "POST",
    classData
  );
};

/**
 * Posts attendance data for a specific class.
 *
 * @param {string} _id - The ID of the class.
 * @param {Attendance} attendanceData - The attendance data to be posted.
 * @returns {Promise<void>} A promise that resolves when the attendance is posted successfully.
 */
export const postAttendance = async (
  classId: string,
  attendanceData: Attendance
) => {
  return handleAPIRequest<void>(
    `${API_URL}${ENDPOINT.postAttendance.replace(":classId", classId)}`,
    "POST",
    attendanceData
  );
};

/**
 * Retrieves a class record from the API based on the provided ID.
 *
 * @param {string} _id - The ID of the class record.
 * @returns {Promise<ClassRecord>} A promise that resolves to the retrieved class record.
 */
export const getClassRecord = async (classId: string) => {
  return handleAPIRequest<ClassRecord>(
    `${API_URL}${ENDPOINT.getClassRecord.replace(":classId", classId)}`,
    "GET"
  );
};

/**
 * Updates a class record in the API.
 *
 * @param {string} classId - The ID of the class record to be updated.
 * @param {ClassRecord} data - The updated class record data.
 * @returns {Promise<ClassRecord>} A promise that resolves to the updated class record.
 */
export const updateClassRecord = async (classId: string, data: Partial<ClassRecord>) => {
  return handleAPIRequest(
    `${API_URL}${ENDPOINT.updateClassRecord.replace(":classId", classId)}`,
    "PATCH",
    data
  );
};

/**
 * Retrieves all class records from the API.
 *
 * @returns {Promise<any[]>} A promise that resolves to an array of class records.
 */
export const getAllClassRecords = async () => {
  return handleAPIRequest<any[]>(
    `${API_URL}${ENDPOINT.getAllClassRecords}`,
    "GET"
  );
};

/**
 * Retrieves live class session records from the API.
 *
 * @returns {Promise<any[]>} A promise that resolves to an array of live class session records.
 */
export const getLiveClassSessions = async () => {
  return handleAPIRequest<ClassRecord[]>(
    `${API_URL}${ENDPOINT.getLiveClassSessions}`,
    "GET"
  );
};

/**
 * Retrieves recently ended class session records from the API.
 *
 * @returns {Promise<any[]>} A promise that resolves to an array of recently ended class session records.
 */
export const getRecentClasses = async () => {
  return handleAPIRequest<any[]>(
    `${API_URL}${ENDPOINT.getRecentlyEndedClasses}`,
    "GET"
  );
};

/**
 * Retrieves class session data from the sessionStorage.
 *
 * @returns {ClassRecord} The retrieved class session data.
 */
export const getLocalClassSessionData = (): ClassRecord => {
  return JSON.parse(sessionStorage.getItem(STORAGE_NAME.classSessionData)!);
};

/**
 * Saves class session data to the sessionStorage.
 *
 * @param {ClassRecord} data 
 */
export function setLocalClassSessionData(data: ClassRecord){
  sessionStorage.setItem(STORAGE_NAME.classSessionData, JSON.stringify(data))
}

/**
 * Handles the deletion of a resource (class record or attendance) from the API.
 *
 * @param {string} id - The ID of the resource to be deleted.
 * @param {HandleDeleteType} type - The type of resource to be deleted.
 * @returns {Promise<void>} A promise that resolves when the resource is deleted successfully.
 */
export const handleDelete = async (id: string | undefined, type: HandleDeleteType) => {
  try {
    const response = await fetch(`${API_URL}/delete-${type}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) console.error(`${type} with ID ${id} deleted successfully.`)
    else console.error(`Failed to delete ${type} with ID ${id}.`);
  } catch (error) {
    console.error(
      `An error occurred while deleting ${type} with ID ${id}.`,
      error
    );
  }
};
