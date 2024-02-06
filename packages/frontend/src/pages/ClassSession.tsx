import {
  ChangeEvent, useCallback,
  useEffect,
  useState
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getClassRecord,
  getLocalClassSessionData, updateClassRecord
} from "@api/class-record-api";
import SearchBox from "@components/shared/SearchBox";
import { FM, PAGES_PATH, STORAGE_NAME } from "shared-library/src/constants";
import { filterSearchQuery } from "@helpers/search-functions";
import { Attendance, ClassRecord } from "@shared-library/types";
import { getClassSessionData, getUserSessionData } from "@api/admin-api";
import ManualAttendance from "@components/class-session/ManualAttendance";
import InitialClassSessionForm from "@components/class-session/InitialClassSessionForm";
import { useClassSessionStore } from "../stores/Stores";
import { isEmpty } from "radash";

const ClassSession = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [searchResults, setSearchResults] = useState<Attendance[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [session, setSession] = useState<ClassRecord>();
  const currentSession = useClassSessionStore();
  const sessionDetails = [
    { label: "Class", value: currentSession.classroom },
    { label: "Course", value: currentSession.course },
    { label: "Date", value: currentSession.date },
    { label: "Start Time", value: currentSession?.startTime },
    { label: "End Time", value: currentSession.endTime },
    { label: "Status", value: currentSession.status },
  ];
  const navigate = useNavigate();
  const [initialFormModal, setInitialFormModal] = useState(false);
  const [manualAttendanceModal, setManualAttendanceModal] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchSessionFromLocal = async () => {
    try {
      const existingSession = getLocalClassSessionData();
      if (!isEmpty(existingSession)) setInitialFormModal(true);
      else {
        setInitialFormModal(false);
        const data = await getClassRecord(existingSession._id!);
        setAttendance(data?.attendance!);

        const filteredMainListData = filterSearchQuery<Attendance>(
          searchQuery,
          attendance,
          ["studentName", "studentId"]
        );
        setSearchResults(filteredMainListData);
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  useEffect(() => {
    fetchSessionFromLocal();
  }, [attendance, searchQuery]);

  const changeSessionStatus = useCallback(() => {
    const currentTime = new Date().toISOString();
    if (currentTime > currentSession.endTime!) {
      setSession({ ...session, status: "Ended" });
    }
  }, [currentSession.endTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      changeSessionStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, [changeSessionStatus]);

  const manualAttendanceQuery = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const handleEndClass = async () => {
    try {
      // Update class record to DB for history
      const classSessionData = getLocalClassSessionData();
      updateClassRecord(classSessionData?._id!, classSessionData);
      const classId = getClassSessionData().classId;
      const userSessionData = getUserSessionData()
      const { name, email } = userSessionData;

      // Reset class session form
      setSession({
        classId: classId,
        lecturer: name,
        classroom: "Classroom 1",
        course: "Food & Beverage",
        date: new Date().toISOString(),
        status: "Not started",
        startTime: "Not set",
        endTime: "Not set",
        attendance: [],
      });
      setSuccess(FM.classSessionEndedSuccessfully);
      // Delay 2 seconds to show success message
      setTimeout(() => {
        navigate(PAGES_PATH.classHistory);
      }, 2000);
    } catch (error) {
      setError(FM.errorEndingClass);
      console.error(error);
    }
  };

  return (
    <div className="m-4">
      <h3 className="text-3xl font-bold">
        <Link to={PAGES_PATH.attendanceSys}>Attendance System</Link> {">"} Class
        Session
      </h3>
      <p className="mb-8">
        To view, download, edit and print past class sessions.
      </p>
      <SearchBox query={searchQuery} onChange={setSearchQuery} />
      <div className="flex justify-between">
        <div className="bg-neutral-400 rounded-md p-4 mt-4 mb-0 w-80">
          {sessionDetails.map((detail, index) => (
            <div key={index} className="flex">
              <p className="font-semibold w-1/3">{detail.label}</p>
              <p className="w-2/3">: {detail.value}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-auto mb-0">
          <div>
            <button
              onClick={handleEndClass}
              className="bg-red-500 rounded-md py-2 px-2 mr-2"
            >
              End Class
            </button>
            <button
              className="bg-purple-400 rounded-md py-2 px-2 mr-2"
              onClick={() => setManualAttendanceModal(true)}
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
        {searchResults?.map((student, index) => (
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
      <ManualAttendance
        isActive={manualAttendanceModal}
        setIsActive={setManualAttendanceModal}
      />
      <InitialClassSessionForm
        isActive={initialFormModal}
        setIsActive={setInitialFormModal}
      />
    </div>
  );
};

export default ClassSession;
