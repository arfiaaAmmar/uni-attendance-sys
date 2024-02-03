import { getUserSessionData } from "@api/admin-api";
import { generateClassId } from "@helpers/shared-helpers";
import { ClassRecord } from "@shared-library/types";

export const dateTimeFormatForClassRecord = () => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-GB");
  const formattedTime = now.toLocaleTimeString("en-US", { hour12: false });
  return `${formattedDate}-${formattedTime}`;
};

export const formatTime = (date: Date): string => {
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes();
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

  return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
};

/**
 * Format toISOString format to hh:mm AM/PM
 *
 * @param {string} dateObj
 * @return {*}  {string}
 */
export const formatTo12HourTime = (dateObj: Date): string => {
  const hours = dateObj.getHours() % 12 || 12;
  const minutes = dateObj.getMinutes();
  const ampm = dateObj.getHours() >= 12 ? 'PM' : 'AM';

  return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
};

export const defClassSession: ClassRecord = {
  classId: generateClassId(),
  lecturer: getUserSessionData().name,
  classroom: 'Classroom 1',
  course: 'Food & Beverage',
  date: new Date().toLocaleDateString('en-GB'),
  status: 'Not started',
  startTime: 'Not set',
  endTime: 'Not set',
  attendance: undefined,
}