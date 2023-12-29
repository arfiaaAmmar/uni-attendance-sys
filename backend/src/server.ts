import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { MONGODB_URI, app, port } from "./config/config";
import AdminController from "@controllers/admin-controller";
import StudentController from "@controllers/student-controller";
import ClassRecordController from "@controllers/class-record-controller";
import { FM, ENDPOINT } from "@shared-library/constants";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error: Error) => {
    console.error(FM.mongoDBConnectionFailed, error); 
  });

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

//Endpoints
//User & Admin
app.post(ENDPOINT.registerAdmin, AdminController.register);
app.post(ENDPOINT.adminLogin, AdminController.login);
app.get(ENDPOINT.getAdminData, AdminController.get);
app.put(ENDPOINT.updateAdminData, AdminController.update);
app.delete(ENDPOINT.deleteAdmin, AdminController.remove);

//Student DB
// app.get(ENDPOINT.queryStudentDB, StudentController.query);
app.post(ENDPOINT.registerStudent, StudentController.register);
app.get(ENDPOINT.getStudent, StudentController.get);
app.get(ENDPOINT.searchStudent, StudentController.search);
app.get(ENDPOINT.getAllStudents, StudentController.getAll);
app.delete(ENDPOINT.deleteStudent, StudentController.remove);

//Class Record - Also can configure ClassSession as well
app.get(ENDPOINT.getLiveClassSessions, ClassRecordController.getLiveSessions);
app.post(ENDPOINT.postClassRecord, ClassRecordController.post);
app.post(ENDPOINT.postAttendance, ClassRecordController.postAttendance);
app.get(ENDPOINT.getClassRecord, ClassRecordController.getRecord);
app.get(ENDPOINT.getAllClassRecords, ClassRecordController.getAll);
app.put(ENDPOINT.updateClassRecord, ClassRecordController.updateRecord);
app.delete(ENDPOINT.deleteClassRecord, ClassRecordController.removeRecord);
app.delete(ENDPOINT.removeAttendance, ClassRecordController.removeAttendance);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
