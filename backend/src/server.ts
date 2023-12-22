import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { MONGODB_URI, app, port } from "./config/config";
import { ClassRecordController } from "@controllers/class-record-controller";
import { AdminController } from "@controllers/admin-controller";
import { StudentController } from "@controllers/student-controller";
import { FM, API } from "@shared-library/constants";

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
app.post(API.registerAdmin, AdminController.register);
app.post(API.adminLogin, AdminController.login);
app.get(API.getAdminData, AdminController.getAdmin);
app.put(API.updateAdminData, AdminController.updateAdmin);
app.delete(API.deleteAdmin, AdminController.remove);

//Student DB
app.post(API.registerStudent, StudentController.register);
app.get(API.getStudent, StudentController.get);
app.get(API.searchStudent, StudentController.search);
app.get(API.getAllStudents, StudentController.getAll);
app.delete(API.deleteStudent, StudentController.remove);

//Class Record - Also can configure ClassSession as well
app.get(API.getLiveClassSessions, ClassRecordController.getLiveSessions);
app.post(API.postClassRecord, ClassRecordController.post);
app.post(API.postAttendance, ClassRecordController.postAttendance);
app.get(API.getClassRecord, ClassRecordController.getRecord);
app.get(API.getAllClassRecords, ClassRecordController.getAll);
app.put(API.updateClassRecord, ClassRecordController.updateRecord);
app.delete(API.deleteClassRecord, ClassRecordController.removeRecord);
app.delete(API.removeAttendance, ClassRecordController.removeAttendance);

//サーバーの起動
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
