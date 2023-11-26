import { Request, Response } from "express";
import mongoose from "mongoose";
import express from "express"
import cors from "cors";
import { MONGODB_URI, app, port } from "./config/config";
import { ENDPOINTS } from '../../shared-library/constants';
import adminController from "./controllers/admin-controller";
import studentController from './controllers/student-controller';
import classRecordController from "./controllers/classrecord-controller";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

//Endpoints
//User & Admin
app.post(ENDPOINTS.registerAdmin, adminController.register);
app.post(ENDPOINTS.adminLogin, adminController.login);
app.get(ENDPOINTS.getAdminData, adminController.getAdminData);
app.put(ENDPOINTS.updateAdminData, adminController.updateAdminData);
app.delete(ENDPOINTS.deleteAdmin, adminController.deleteAdmin);
//Student DB
app.post(ENDPOINTS.registerStudent, studentController.registerStudent);
app.get(ENDPOINTS.getStudent, studentController.getStudent);
app.get(ENDPOINTS.searchStudent, studentController.searchStudent);
app.get(ENDPOINTS.getAllStudents, studentController.getAllStudents);
app.delete(ENDPOINTS.deleteStudent, studentController.removeStudent);
//Class Record - Also can configure ClassSession as well
app.get(ENDPOINTS.getLiveClassSessions, classRecordController.getLiveClassSessions);
app.post(ENDPOINTS.postClassRecord, classRecordController.postClassRecord);
app.post(ENDPOINTS.postAttendance, classRecordController.postAttendance);
app.get(ENDPOINTS.getClassRecord, classRecordController.getClassRecord);
app.get(ENDPOINTS.getAllClassRecords, classRecordController.getAllClassRecords);
app.put(ENDPOINTS.updateClassRecord, classRecordController.updateClassRecord);
app.delete(ENDPOINTS.deleteClassRecord, classRecordController.deleteClassRecord);
app.delete(ENDPOINTS.deleteAttendanceRecord, classRecordController.deleteAttendanceRecord);

//サーバーの起動
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
