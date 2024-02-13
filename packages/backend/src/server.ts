import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { authoriseAdmin, loginAdmin, registerAdmin, removeAdmin, updateAdmin } from "@controllers/admin-controller";
import { deleteStudent, getAllStudents, getStudent, registerStudent, searchStudent } from "@controllers/student-controller";
import { getAllClassRecord, getClassRecord, getLiveSessions, postAttendance, postClassRecord, removeAttendance, removeClassRecord, updateClassRecord } from "@controllers/class-record-controller";
import { MONGODB_URI, NODE_ENV, port } from "@config/config";
import { ENDPOINT, FM } from 'shared-library/dist/constants'

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    if (NODE_ENV === 'dev') console.log("Connected to MongoDB");
  })
  .catch((error: Error) => {
    console.error(FM.mongoDBConnectionFailed, error);
  });

const app = express();
app.use(cors());
app.use(express.json());

//Endpoints
//User & Admin
app.post(ENDPOINT.registerAdmin, registerAdmin); // done
app.post(ENDPOINT.adminLogin, loginAdmin); // done
app.get(ENDPOINT.authoriseAdmin, authoriseAdmin); // done
app.put(ENDPOINT.updateAdminData, updateAdmin); // done
app.delete(ENDPOINT.deleteAdmin, removeAdmin); // done

//Student DB
// app.get(ENDPOINT.queryStudentDB, query);
app.post(ENDPOINT.registerStudent, registerStudent); // done
app.get(ENDPOINT.getStudent, getStudent); // 
app.get(ENDPOINT.searchStudent, searchStudent);
app.get(ENDPOINT.getAllStudents, getAllStudents);
app.delete(ENDPOINT.deleteStudent, deleteStudent);

//Class Record - Also can configure ClassSession as well
app.get(ENDPOINT.getLiveClassSessions, getLiveSessions);
app.post(ENDPOINT.postClassRecord, postClassRecord);
app.post(ENDPOINT.postAttendance, postAttendance);
app.get(ENDPOINT.getClassRecord, getClassRecord);
app.get(ENDPOINT.getAllClassRecords, getAllClassRecord);
app.put(ENDPOINT.updateClassRecord, updateClassRecord);
app.delete(ENDPOINT.deleteClassRecord, removeClassRecord);
app.delete(ENDPOINT.removeAttendance, removeAttendance);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

