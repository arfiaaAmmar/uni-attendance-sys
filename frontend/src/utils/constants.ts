export const STUDENT_COURSES = {
  IT: "Information Technology",
  FnB: "Food & Beverages",
  SECRETARY: "Secretary",
  SECURITY: "Security",
};

export const CLASSROOM_LIST = [
  "Classroom 1",
  "Classroom 2",
  "Classroom 3",
  "Classroom 4",
];

export const API_BASE_URL = "http://localhost:8888";

export const dateTimeFormatForClassRecord = () => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-GB");
  const formattedTime = now.toLocaleTimeString("en-US", { hour12: false });
  return `${formattedDate}-${formattedTime}`;
};
