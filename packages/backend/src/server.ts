import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { authoriseAdmin, loginAdmin, registerAdmin, removeAdmin, updateAdmin } from "@controllers/admin-controller";
import { deleteStudent, getAllStudents, getStudent, registerStudent, searchStudent } from "@controllers/student-controller";
import { getAllClassRecords, getClassRecord, getLiveSessions, getRecentlyEndedSessions, postAttendance, postClassRecord, removeAttendance, removeClassRecord, updateClassRecord } from "@controllers/class-record-controller";
import { MONGODB_URI, port } from "@config/config";
import { ENDPOINT, FM } from 'shared-library/dist/constants';

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
app.get(ENDPOINT.getStudent, getStudent); // done
app.get(ENDPOINT.searchStudent, searchStudent);
app.get(ENDPOINT.getAllStudents, getAllStudents); // done
app.delete(ENDPOINT.deleteStudent, deleteStudent); // done

//Class Record - Also can configure ClassSession as well
app.get(ENDPOINT.getRecentlyEndedClasses, getRecentlyEndedSessions);
app.get(ENDPOINT.getLiveClassSessions, getLiveSessions); // 
app.post(ENDPOINT.postClassRecord, postClassRecord); // Done
app.patch(ENDPOINT.postAttendance, postAttendance); // TODO Currently attendance is posted in updateClass()
app.get(ENDPOINT.getClassRecord, getClassRecord); // Done
app.get(ENDPOINT.getAllClassRecords, getAllClassRecords); // Done
app.patch(ENDPOINT.updateClassRecord, updateClassRecord); // Done
app.delete(ENDPOINT.deleteClassRecord, removeClassRecord); // Done
app.delete(ENDPOINT.removeAttendance, removeAttendance);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

