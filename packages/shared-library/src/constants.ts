export const CONTENT_TYPE_APPLICATION_JSON = { "Content-Type": "application/json" } as const;

export const STORAGE = {
  token: "token",
  userData: "userData",
  classSession: "classSession",
} as const;

export const API_BASE_URL = "http://localhost:8888";
// export const API_BASE_URL + "http://localhost:8888";

export const ENDPOINT = {
  queryStudentDB: "/query-student-db/suggestions?query=${value}",
  registerAdmin: "/register-admin",
  adminLogin: "/admin-login",
  getAdminData: "/get-admin-data",
  updateAdminData: "/update-admin-data",
  deleteAdmin: "/delete-admin/:adminId",
  registerStudent: "/register-student",
  getStudent: "/get-student/:studentId",
  searchStudent: "/search-student",
  getAllStudents: "/get-all-students",
  deleteStudent: "/delete-student/:studentId",
  getLiveClassSessions: "/get-live-class-sessions",
  postClassRecord: "/post-class-record",
  postAttendance: "/post-attendance/:classId",
  getClassRecord: "/get-class-record/:classId",
  getAllClassRecords: "/get-all-class-records",
  updateClassRecord: "/update-class-record/:classId",
  deleteClassRecord: "/delete-class-record/:classId",
  removeAttendance: "/delete-attendance/:classId",
} as const;

export const PAGES_PATH = {
  login: '/login',
  studentDB: '/admin/student_database',
  attendanceSys: '/admin/attendance_system',
  classSession: "/admin/attendance_system/class_session",
  classHistory: "/admin/attendance_system/class_history",
} as const

export const FM = {
  default: "An error occured",
  invalidCredentials: "Authorization token not provided",
  loginSuccess: "Login successful",
  loginFailed: "Failed to login",
  userExist: "User already exist",
  userNotFound: "User not found",
  userRegisterSuccess: "User registered successfully",
  userRegisterFailed: "User register failed",
  adminNotFound: "Admin not found",
  adminUpdateSuccess: "Admin updated successfully",
  adminUpdateError: "Error updating admin",
  studentRegisterSuccess: "Student registered succesfully",
  studentRegisterFailed: "Error registering user",
  invalidQuery: "Invalid query",
  studentRetrievalFailed: "Student retrieval failed",
  studentNotFound: "Student not found",
  studentDeleteSuccess: "Student deleted successfully",
  studentDeleteFailed: "Failed to delete student",
  classRecordNotFound: "Class record not found",
  classRecordCreationFailed: "Error creating class record",
  errorUpdatingClassRecord: "Error updating class record",
  classRecordRetrievalFailed: "Error retrieving class record",
  classRecordDeleteSuccess: "Class record deleted successfully",
  classRecordDeleteFailed: "Error deleting class record",
  liveClassSessionNotFound: "No live class sessions found",
  addingAttendanceFailed: "Error adding attendance",
  addingAttendanceSuccess: "Attendance added successfully",
  mongoDBConnectionFailed: " Failed to connect to MongoDB",
  classStartSuccess: "Class started successfully",
  serverError: "Internal server error",
  noAuthToken: "Authorization token not provided",
  pleaseCreateClassFirst: "Please create class session first",
  leavePageConfirmation: "Are you sure you want to leave this page ?",
} as const;

export const defFeedback = {
  success: "",
  error: "",
};
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
