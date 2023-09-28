import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getClassRecord,
  postClassRecord,
  updateClassRecord
} from "../api/classRecordApi";
import SearchBox from '../components/SearchBox';
import {
  Feedback,
  IClassRecord, IStudentAttendance
} from "shared-library/types";

const ClassSession = () => {
  const [studentList, setStudentList] = useState<IStudentAttendance[]>();
  const [filteredStudentList, setFilteredStudentList] =
    useState<IStudentAttendance[]>();
  const [modal, setModal] = useState({
    initialCreateClass: false,
    manualAttendance: false
  });
  const [feedback, setFeedback] = useState<Feedback>({
    success: "",
    error: "",
  });
  const formatDateTime = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB");
    const formattedTime = now.toLocaleTimeString("en-US", { hour12: false });
    return `${formattedDate}-${formattedTime}`;
  };

  // })
  const [searchQuery, setSearchQuery] = useState("");
  const [classRecordForm, setClassRecordForm] = useState<IClassRecord>({
    lecturer: sessionStorage.getItem("userName")!,
    classroom: "",
    course: "",
    date: new Date().toLocaleDateString("en-GB"),
    startTime: "Not set",
    endTime: "Not set",
    attendance: studentList,
  });

  const handleInitialFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      classRecordForm.course === "" ||
      classRecordForm.lecturer === "" ||
      classRecordForm.classroom === "" ||
      classRecordForm.startTime === "" ||
      classRecordForm.endTime === "" ||
      classRecordForm.date === new Date().getDate().toLocaleString("en-US")
    ) {
      setFeedback({ ...feedback, error: "Please fill in all user data" });
      return;
    }
    try {
      sessionStorage.setItem("classSession", classRecordForm.toString());
      await postClassRecord(classRecordForm);
    } catch (error: any) {
      setFeedback({ ...feedback, error: error.message });
    }
  };

  useEffect(() => {
    async () => {
      const existingSession = JSON.parse(
        sessionStorage.getItem("classSession")!
      ) as IClassRecord;
      try {
        if (!existingSession) {
          setModal({...modal, initialCreateClass: true})
        }
        if (existingSession) {
          setModal({...modal, initialCreateClass: false})
          const data = await getClassRecord(existingSession.classId);
          setStudentList(data);
        }
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };
  }, []);

  useEffect(() => {
    if (studentList) {
      const filteredList = studentList.filter((student) =>
        ["studentName", "studentId", "attendanceTime"].some((prop) =>
          student[prop as keyof IStudentAttendance]
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
      setFilteredStudentList(filteredList);
    }
  }, [studentList, searchQuery]);

  const handleSubmitClassSession = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      classRecordForm.classroom === "" ||
      classRecordForm.course === "" ||
      classRecordForm.startTime === "" ||
      classRecordForm.endTime === ""
    ) {
      setFeedback({ ...feedback, error: "Please fill in all class info" });
      return;
    }
    try {
      //Post class
      await postClassRecord({
        classId: `${classRecordForm.course}-${formatDateTime()}`,
        lecturer: sessionStorage.getItem("userName"),
        classroom: classRecordForm.classroom,
        course: classRecordForm.course,
        startTime: classRecordForm.startTime,
        endTime: classRecordForm.endTime,
        attendance: studentList,
        date: classRecordForm.date,
      });
      setFeedback({ ...feedback, success: "Successfully started class!" });

      setTimeout(() => {
        setFeedback({ ...feedback, success: "" });
      }, 3000);
      // Fetch updated student attendance list and update in current class record
      // const updatedAttendance = await getCurrentClassRecord();
      // setStudentList(updatedAttendance);

      console.log("New user registered successfully");
    } catch (error: unknown) {
      console.error("Error registering new user:", error);
      setFeedback({ ...feedback, error: error });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setClassRecordForm((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEndClass = async () => {
    //user fill form which is student id
    //search id in studentDB
    //display in modal to confirm
    //set add attendance
    // Clear form inputs
    updateClassRecord;

    setClassRecordForm({
      lecturer: sessionStorage.getItem("userName")!,
      classroom: "Not set",
      course: "Not set",
      date: new Date().toLocaleDateString("en-GB"),
      startTime: "Not set",
      endTime: "Not set",
      attendance: [],
    });
  };

  return (
    <div className="m-4">
      <h3 className="text-3xl font-bold">
        <Link to="/admin/attendance_system">Attendance System</Link> {">"} Class
        Session
      </h3>
      <p className="mb-8">
        To view, download, edit and print past class sessions.
      </p>
      <SearchBox query={searchQuery} onChange={setSearchQuery} />
      <div className="flex justify-between">
        <div className="bg-neutral-400 rounded-md p-4 mt-4 mb-0 w-80">
          <div className="flex">
            <p className="font-semibold w-1/3">Class </p>
            <p className="w-2/3">: {classRecordForm.classroom}</p>
          </div>
          <div className="flex">
            <p className="font-semibold w-1/3">Course </p>
            <p className="w-2/3">: {classRecordForm.course}</p>
          </div>
          <div className="flex">
            <p className="font-semibold w-1/3">Date </p>
            <p className="w-2/3">: {classRecordForm.date}</p>
          </div>
          <div className="flex">
            <p className="font-semibold w-1/3">Start Time</p>
            <p className="w-2/3">: {classRecordForm.startTime}</p>
          </div>
          <div className="flex">
            <p className="font-semibold w-1/3">End Time</p>
            <p className="w-2/3 ">: {classRecordForm.endTime}</p>
          </div>
          <button
            onClick={() => handleEndClass()}
            className="bg-red-500 px-2 py-1 rounded-md text-white font-bold mr-0 ml-auto mt-4"
          >
            End Class
          </button>
        </div>
        <div className="flex justify-between mt-auto mb-0">
          <div>
            <button
              className="bg-purple-400 rounded-md py-2 px-2 mr-2"
              onClick={() => setModal({...modal, manualAttendance: true})}
            >
              Manual Attendance
            </button>
            <button className="bg-green-500 rounded-md py-2 px-2 mr-2">
              Upload Excel
            </button>
            {/* <input
              type="file"
              name="Upload Excel"
              id="uploadExcel"
              accept=".xlsx, .xls"
              aria-label="Upload Excel"
            /> */}
            <button className="bg-yellow-600 rounded-md py-2 px-2 ">
              Download PDF
            </button>
          </div>
        </div>
      </div>
      <div className="bg-neutral-400 flex px-4 py-2 justify-evenly h-14 mt-4">
        <p className="font-semibold w-1/12">No.</p>
        <p className="font-semibold w-5/12">Full Name</p>
        <p className="font-semibold w-3/12">Student ID</p>
        {/* <p className="font-semibold w-1/6">Intake Session</p> */}
        {/* <p className="font-semibold w-1/6">Course</p> */}
        <p className="font-semibold w-1/6">Status</p>
      </div>
      <div className="bg-neutral-200 h-[30vh] overflow-y-auto">
        {filteredStudentList?.map((student, index) => (
          <div
            key={student.studentId}
            className="flex px-4 py-2 justify-evenly h-14"
          >
            <p className="w-1/12">{index + 1}</p>
            <p className="w-5/12">{student.studentName}</p>
            <p className="w-3/12">{student.studentId}</p>
            <p className="w-3/12"> Next time </p>
          </div>
        ))}
      </div>
      {modal.manualAttendance && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md p-8">
            <p className="text-lg mb-4">Start Class</p>
            {typeof feedback.error === "string" ? (
              <p className="text-red-500 font-bold">{feedback.error}</p>
            ) : feedback.success ? (
              <p className="text-green-600 font-bold">{feedback.success}</p>
            ) : null}

            <form onSubmit={handleSubmitClassSession}>
              <p>Seach Student Name</p>
              <SearchBox placeholder="Seach name / matrik"/>
              <div className="flex justify-between mt-4">
                <Button
                  onClick={handleSubmitClassSession}
                  variant="contained"
                  className="bg-green-600 text-white font-bold"
                  type="submit"
                >
                  Submit
                </Button>
                <Button
                  onClick={() => setModal({...modal, manualAttendance: false})}
                  variant="outlined"
                  className="text-gray-600"
                >
                  Close
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {modal.initialCreateClass && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md p-8">
            <p className="text-lg mb-4">Create New Class Session</p>
            {feedback.error ? (
              <p className="text-red-500 font-bold">
                {feedback.error.toString()}
              </p>
            ) : feedback.success ? (
              <p className="text-green-600 font-bold">{feedback.success}</p>
            ) : null}

            <form onSubmit={handleInitialFormSubmit}>
              <input
                type="text"
                placeholder="Lecturer Name"
                value={sessionStorage.getItem("userName")!}
                className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
              />
              <select
                name="course"
                id="course"
                className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
                value={classRecordForm.course}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select a course
                </option>
                <option value="IT">Information Technology</option>
                <option value="Security">Security</option>
                <option value="Secretary">Secretary</option>
                <option value="FnB">Food & Beverage</option>
              </select>
              <select
                name="classroom"
                id="classroom"
                className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
                value={classRecordForm.course}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select classroom
                </option>
                <option value="Classroom 1">Classroom 1</option>
                <option value="Classroom 2">Classroom 2</option>
                <option value="Classroom 3">Classroom 3</option>
                <option value="Classroom 4">Classroom 4</option>
              </select>
              <input
                type="text"
                name="lecturer"
                placeholder="Lecturer"
                value={classRecordForm.lecturer}
                onChange={handleChange}
                className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
              />
              <input
                type="time"
                name="Start Time"
                value={classRecordForm.startTime}
                onChange={handleChange}
                className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
              />
              <input
                type="time"
                name="End Time"
                value={classRecordForm.startTime}
                onChange={handleChange}
                className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
              />
              <div className="flex justify-between mt-4">
                <Button
                  onClick={handleInitialFormSubmit}
                  variant="contained"
                  className="bg-green-600 text-white font-bold"
                  type="submit"
                >
                  Submit
                </Button>
                <Button
                  onClick={() => setModal({...modal, initialCreateClass: false})}
                  variant="outlined"
                  className="text-gray-600"
                >
                  Close
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSession;
