import { Request, Response } from "express";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import { MONGODB_URI, app, port } from "./config/config";
import {
  deleteAdmin,
  getAdminData,
  login,
  register,
  updateAdminData,
} from "./controllers/admin-controller";
import {
  getAllStudents,
  getStudent,
  registerStudent,
  removeStudent,
  searchStudent,
} from "./controllers/student-controller";
import {
  deleteAttendanceRecord,
  deleteClassRecord,
  getAllClassRecords,
  getClassRecord,
  getLiveClassSessions,
  postAttendance,
  postClassRecord,
  updateClassRecord,
} from "./controllers/class-record-controller";
import { ENDPOINTS, FM } from "shared-library/src/constants";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(FM.mongoDBConnectionFailed, error);
  });

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

//Endpoints
//User & Admin
app.post(ENDPOINTS.registerAdmin, register);
app.post(ENDPOINTS.adminLogin, login);
app.get(ENDPOINTS.getAdminData, getAdminData);
app.put(ENDPOINTS.updateAdminData, updateAdminData);
app.delete(ENDPOINTS.deleteAdmin, deleteAdmin);
//Student DB
app.post(ENDPOINTS.registerStudent, registerStudent);
app.get(ENDPOINTS.getStudent, getStudent);
app.get(ENDPOINTS.searchStudent, searchStudent);
app.get(ENDPOINTS.getAllStudents, getAllStudents);
app.delete(ENDPOINTS.deleteStudent, removeStudent);
//Class Record - Also can configure ClassSession as well
app.get(ENDPOINTS.getLiveClassSessions, getLiveClassSessions);
app.post(ENDPOINTS.postClassRecord, postClassRecord);
app.post(ENDPOINTS.postAttendance, postAttendance);
app.get(ENDPOINTS.getClassRecord, getClassRecord);
app.get(ENDPOINTS.getAllClassRecords, getAllClassRecords);
app.put(ENDPOINTS.updateClassRecord, updateClassRecord);
app.delete(ENDPOINTS.deleteClassRecord, deleteClassRecord);
app.delete(ENDPOINTS.deleteAttendanceRecord, deleteAttendanceRecord);

//サーバーの起動
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
