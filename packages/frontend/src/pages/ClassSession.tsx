import { Button, InputAdornment, TextField } from "@mui/material";
import { Search } from "@mui/icons-material"
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getClassRecord,
  getClassSessionData,
  postAttendance,
  postClassRecord,
  updateClassRecord,
} from "../api/class-record-api";
import SearchBox from "../components/SearchBox";
import { formatTo12HourTime } from "../utils/constants";
import {
  CLASSROOM_LIST,
  FM,
  PAGES_PATH,
  STORAGE,
  STUDENT_COURSES,
} from "shared-library/src/constants";
import { filterSearchQuery } from "../helpers/search-functions";
import {
  ClassRecord,
  Feedback,
  Attendance,
  ClassStatus,
} from "@shared-library/types";
import { defFeedback } from "@shared-library/constants";
import { getUserSessionData } from "@api/admin-api";

const ClassSession = () => {
  const [attendance, setAttendance] = useState<Attendance[]>();
  const [filteredAttendance, setFilteredAttendance] = useState<Attendance[]>();
  const [searchAttendanceQuery, setSearchAttendanceQuery] = useState("");
  const [manualAttendanceQuery, setManualAttendanceQuery] = useState("");
  const [classStatus, setClassStatus] = useState<ClassStatus>("Not started");
  const [feedback, setFeedback] = useState<Feedback>(defFeedback);
  const [initialFormFeedback, setInitialFormFeedback] = useState("");
  const [manualAttendanceFeedback, setManualAttendanceFeedback] = useState("");
  const navigate = useNavigate();
  const currentTime = new Date();
  const [classRecordForm, setClassRecordForm] = useState<ClassRecord>({
    lecturer: sessionStorage.getItem("userName")!,
    classroom: "Classroom 1",
    course: "Food & Beverage",
    date: currentTime.toLocaleDateString("en-GB"),
    startTime: "Not set",
    endTime: "Not set",
    attendance: undefined,
  });
  const [modal, setModal] = useState({
    initiateClassModal: false,
    manualAttendanceModal: false,
  });

  // Initial Class Session fetch from local session if any
  useEffect(() => {
    const fetchClassSessions = async () => {
      try {
        const existingSession = getClassSessionData();
        if (!existingSession) setModal({ ...modal, initiateClassModal: true });
        if (existingSession) {
          setModal({ ...modal, initiateClassModal: false });
          const data = await getClassRecord(existingSession._id!);
          setAttendance(data.attendance);

          const filteredMainListData = filterSearchQuery<Attendance>(
            searchAttendanceQuery,
            attendance!,
            ["studentName", "studentId"]
          );
          setFilteredAttendance(filteredMainListData);
        }
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };

    fetchClassSessions();
  }, [attendance, searchAttendanceQuery]);

  const emptyClassRecordForm = Object.values(classRecordForm).some(
    (value) => value === ""
  );

  const handleClassStatus = useCallback(() => {
    const currentTime = new Date().toISOString();
    if (currentTime > classRecordForm.endTime!) {
      setClassStatus("Ended");
    }
  }, [classRecordForm.endTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleClassStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, [handleClassStatus]);

  const handleManualAttendanceQuery = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
  };

  const handleManualAttendanceSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newAttendance: Attendance = {
        studentId: e,
        studentNames: e,
        attendanceTime: new Date().toISOString(),
      };
      await postAttendance(
        classRecordForm._id,
        getClassSessionData().attendances
      );

      setManualAttendanceFeedback(FM.addingAttendanceSuccess);
    } catch (error) {
      console.error(error);
      setManualAttendanceFeedback(FM.addingAttendanceFailed);
    }
  };

  const fetchSuggestionData = () => {
    return ["test", "test2"];
  };

  const handleSubmitClassSession = async (event: FormEvent) => {
    event.preventDefault();
    if (emptyClassRecordForm) {
      setFeedback({ ...feedback, error: "Please fill in all class info" });
      return;
    }
    try {
      //Post class
      const userSessionData = await getUserSessionData();
      await postClassRecord({
        ...classRecordForm,
        lecturer: userSessionData.name,
        attendance,
      });
      setFeedback({ ...feedback, success: FM.classStartSuccess });
      setClassStatus("Ongoing");
      setTimeout(() => {
        setFeedback({ ...feedback, success: "" });
      }, 3000);

      console.log(FM.userRegisterSuccess);
    } catch (error: any) {
      console.error("Error registering new user:", error);
      setFeedback({ ...feedback, error });
    }
  };

  const handleCloseInitialFormSubmit = () => {
    if (classStatus === "Not started")
      setInitialFormFeedback(FM.pleaseCreateClassFirst);
    else setModal({ ...modal, initiateClassModal: false });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setClassRecordForm((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEndClass = async () => {
    try {
      // Update class record to DB for history
      const classSessionData = getClassSessionData();
      updateClassRecord(classSessionData?._id!, classSessionData);

      // Reset class record form
      setClassRecordForm({
        lecturer: getUserSessionData().name,
        classroom: "Classroom 1",
        course: "Food & Beverage",
        date: new Date().toISOString(),
        startTime: "Not set",
        endTime: "Not set",
        attendance: [],
      });

      setClassStatus("Ended");
      navigate(PAGES_PATH.classHistory);
    } catch (error) {
      console.error(error);
    }
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
      <SearchBox
        query={searchAttendanceQuery}
        onChange={setSearchAttendanceQuery}
      />
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
            <p className="w-2/3">: {classRecordForm?.startTime}</p>
          </div>
          <div className="flex">
            <p className="font-semibold w-1/3">End Time</p>
            <p className="w-2/3 ">: {classRecordForm.endTime}</p>
          </div>
          <div className="flex">
            <p className="font-semibold w-1/3">Status</p>
            <p className="w-2/3 ">: {classStatus}</p>
          </div>
        </div>
        <div className="flex justify-between mt-auto mb-0">
          <div>
            <button
              onClick={() => handleEndClass()}
              className="bg-red-500 rounded-md py-2 px-2 mr-2"
            >
              End Class
            </button>
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
        <p className="font-semibold w-1/6">Status</p>
      </div>
      <div className="bg-neutral-200 h-[30vh] overflow-y-auto">
        {filteredAttendance?.map((student, index) => (
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
            {manualAttendanceFeedback === FM.addingAttendanceSuccess ? (
              <p className="text-green-500 font-bold">
                {manualAttendanceFeedback}
              </p>
            ) : (
              <p className="text-red-600 font-bold">
                {manualAttendanceFeedback}
              </p>
            )}

            <form onSubmit={handleManualAttendanceSubmit}>
              <p>Seach Student Name</p>
             <TextField
              className=""
              autoFocus={true}
              inputRef={query}
              id="outlined-full-width"
              label="Search student"
              style={{margin: 8}}
              placeholder="Ali bin Abu"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true}}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button className="go" variant="contained" type="submit">
                      Go
                    </Button>
                  </InputAdornment>
                )
              }}
             />
            </form>
          </div>
        </div>
      )}
      {modal.initiateClassModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="bg-white rounded-md p-8 w-1/3">
            <p className="text-lg mb-4">Create New Class Session</p>
            <form onSubmit={handleSubmitClassSession}>
              <input
                type="text"
                name="lecturer"
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
                {Object.values(STUDENT_COURSES).map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
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
                {CLASSROOM_LIST.map((classroom, index) => (
                  <option key={index} value={classroom}>
                    {classroom}
                  </option>
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
                type="datetime-local"
                name="Start Time"
                placeholder="Set start time"
                value={classRecordForm.startTime}
                onChange={handleChange}
                className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
              />
              <input
                type="datetime-local"
                name="End Time"
                placeholder="Set end time"
                value={classRecordForm.endTime}
                onChange={handleChange}
                className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
              />
              {initialFormFeedback !== FM.pleaseCreateClassFirst ? (
                <p className="text-green-500 font-bold">
                  {initialFormFeedback}
                </p>
              ) : (
                <p className="text-red-500 font-bold">{initialFormFeedback}</p>
              )}
              <div className="flex justify-between mt-4">
                <Button
                  onSubmit={handleSubmitClassSession}
                  variant="contained"
                  className="bg-green-600 text-white font-bold"
                  type="submit"
                >
                  Submit
                </Button>
                <Button
                  onClick={handleCloseInitialFormSubmit}
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
