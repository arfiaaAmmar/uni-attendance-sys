import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getClassRecord,
  postClassRecord,
  updateClassRecord,
} from "../api/class-record-api";
import SearchBox from "../components/SearchBox";
import {
  CLASSROOM_LIST,
  STUDENT_COURSES,
  dateTimeFormatForClassRecord,
} from "../utils/constants";
import {
  Feedback,
  ClassRecord,
  StudentAttendance,
} from "shared-library/types";
import { filterSearchQuery } from "../helpers/search-functions";

const ClassSession = () => {
  const [mainList, setMainList] = useState<StudentAttendance[]>();
  const [filteredMainList, setFilteredMainList] =
    useState<StudentAttendance[]>();
  const [manualAttendanceList, setManualAttendanceList] = useState([]);
  const [modal, setModal] = useState({
    initiateClassModal: false,
    manualAttendanceModal: false,
  });
  const [feedback, setFeedback] = useState<Feedback>({
    success: "",
    error: "",
  });

  // })
  const [mainQuery, setMainQuery] = useState("");
  const [manualAttendanceQuery, setManualAttendanceQuery] = useState("");
  const [classRecordForm, setClassRecordForm] = useState<ClassRecord>({
    lecturer: sessionStorage.getItem("userName")!,
    classroom: "Classroom 1",
    course: "Food & Beverages",
    date: new Date().toLocaleDateString("en-GB"),
    startTime: "Not set",
    endTime: "Not set",
    attendance: mainList,
  });
  const emptyClassRecordForm = Object.values(classRecordForm).some(
    (value) => value === ""
  );

  const handleInitialFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (emptyClassRecordForm) {
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

  const handleManualAttendanceQuery = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
  };

  const handleManualAttendanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
  };

  useEffect(() => {
    async () => {
      const existingSession = JSON.parse(
        sessionStorage.getItem("classSession")!
      ) as ClassRecord;
      try {
        if (!existingSession) setModal({ ...modal, initiateClassModal: true });
        if (existingSession) {
          setModal({ ...modal, initiateClassModal: false });
          const data = await getClassRecord(existingSession.classId);
          setMainList(data.attendance);

          const filteredMainListData = filterSearchQuery<StudentAttendance>(
            mainQuery,
            mainList!,
            ["studentName", "studentId"]
          );
          setFilteredMainList(filteredMainListData);
        }
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };
  }, [mainList, mainQuery]);

  const handleSubmitClassSession = async (event: React.FormEvent) => {
    event.preventDefault();
    if (emptyClassRecordForm) {
      setFeedback({ ...feedback, error: "Please fill in all class info" });
      return;
    }
    try {
      //Post class
      await postClassRecord({
        classId: `${classRecordForm.course}-${dateTimeFormatForClassRecord()}`,
        lecturer: sessionStorage.getItem("userName"),
        classroom: classRecordForm.classroom,
        course: classRecordForm.course,
        startTime: classRecordForm.startTime,
        endTime: classRecordForm.endTime,
        attendance: mainList,
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
      <SearchBox query={mainQuery} onChange={setMainQuery} />
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
              onClick={() =>
                setModal({ ...modal, manualAttendanceModal: true })
              }
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
        {filteredMainList?.map((student, index) => (
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
      {modal.manualAttendanceModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md p-8">
            <p className="text-lg mb-4">Start Class</p>
            {typeof feedback.error === "string" ? (
              <p className="text-red-500 font-bold">{feedback.error}</p>
            ) : feedback.success ? (
              <p className="text-green-600 font-bold">{feedback.success}</p>
            ) : null}

            <form onSubmit={handleManualAttendanceSubmit}>
              <p>Seach Student Name</p>
              <SearchBox
                placeholder="Seach name / matrik"
                query={manualAttendanceQuery}
                onChange={setManualAttendanceQuery}
                suggestions={fetchSuggestionData}
              />
              <div className="flex justify-between mt-4">
                <Button
                  variant="contained"
                  className="bg-green-600 text-white font-bold"
                  type="submit"
                >
                  Submit
                </Button>
                <Button
                  onClick={() =>
                    setModal({ ...modal, manualAttendanceModal: false })
                  }
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
      {modal.initiateClassModal && (
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
                {Object.values(STUDENT_COURSES).map((course) => (
                  <option value={course}>{course}</option>
                ))}
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
                {CLASSROOM_LIST.map((classroom) => (
                  <option value={classroom}>{classroom}</option>
                ))}
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
                  onClick={() =>
                    setModal({ ...modal, initiateClassModal: false })
                  }
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
