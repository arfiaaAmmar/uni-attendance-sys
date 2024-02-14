import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getClassRecord,
  getLocalClassSessionData, updateClassRecord
} from "@api/class-record-api";
import SearchBox from "@components/shared/SearchBox";
import { FM, PAGES_PATH, STORAGE_NAME } from "shared-library/dist/constants";
import { filterSearchQuery } from "@helpers/search-functions";
import { Attendance } from "shared-library/dist/types";
import { getUserSessionData } from "@api/admin-api";
import ManualAttendance from "@components/class-session/ManualAttendance";
import InitialClassSessionForm from "@components/class-session/InitialClassSessionForm";
import { useClassSessionStore } from "stores/Stores";
import { isEmpty } from "radash";
import { FeedbackMessage } from "@components/shared/FeedbackMessage";
import { defaultClassSession, formatTo12HourTime } from "@utils/constants";
import { handleClassRecordExcelUpload } from "@utils/upload-excel";

const ClassSession = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [searchResults, setSearchResults] = useState<Attendance[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [session, setSession] = useState(getLocalClassSessionData());
  const localSession = getLocalClassSessionData()
  const sessionDetails = [
    { label: "Class", value: localSession?.classroom },
    { label: "Course", value: localSession?.course },
    { label: "Lecturer", value: localSession?.lecturer },
    { label: "Date", value: new Date(localSession?.date!).toLocaleDateString('en-GB') },
    { label: "Start Time", value: formatTo12HourTime(localSession?.startTime!) },
    { label: "End Time", value: formatTo12HourTime(localSession?.endTime!) },
    { label: "Status", value: localSession?.status }
  ];
  const navigate = useNavigate();
  const [initialFormModal, setInitialFormModal] = useState(false);
  const [manualAttendanceModal, setManualAttendanceModal] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchSessionFromLocal = async () => {
    try {
      if (isEmpty(session)) setInitialFormModal(true);
      else {
        setInitialFormModal(false);
        const data = await getClassRecord(localSession?._id!);
        setAttendance(data?.attendance!);

        const filteredMainListData = filterSearchQuery<Attendance>(
          searchQuery,
          attendance,
          ["studentName", "studentId"]
        );
        setSearchResults(filteredMainListData);
        setSession({ ...data, status: "Ended" })
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  async function fetchAttendanceList(classId: string) {
    try {
      const data = await getClassRecord(classId)
      setSession(data)
    } catch (error) {
      console.error("Error fetching class session:", error)
    }
  }

  const handleUploadExcel = () => {
    if (fileInputRef?.current?.files) {
      const selectedFile = fileInputRef.current.files[0];

      if (selectedFile) {
        handleClassRecordExcelUpload(localSession.classId, selectedFile);
        fetchAttendanceList(localSession.classId)
        setSuccess("Uploading excel success")
        setTimeout(() => {
          setSuccess("")
        }, 2000)
      } else {
        setError("Error uploading excel")
        setTimeout(() => {
          setError("")
        }, 2000)
      }
    }
  };

  useEffect(() => {
    fetchSessionFromLocal();
  }, []);

  const changeSessionStatus = useCallback(() => {
    const currentTime = new Date().toISOString();
    if (currentTime > localSession?.endTime!) {
      setSession({ ...session, status: "Ended" });
    }
  }, [localSession?.endTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      changeSessionStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, [changeSessionStatus]);

  const handleEndClass = async () => {
    try {
      // Update class record to DB history before end class
      const classSessionData = getLocalClassSessionData();
      updateClassRecord(classSessionData?._id!, classSessionData);
      const classId = getLocalClassSessionData().classId || localSession?.classId;
      updateClassRecord(classId, { ...session, status: "Ended" })

      // Reset class session
      setSession(defaultClassSession);
      sessionStorage.removeItem(STORAGE_NAME.classSessionData)
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
      <FeedbackMessage {...{ success, error }} />
      <div className="flex justify-between">
        <div className="bg-neutral-400 rounded-md p-4 mt-4 mb-0 w-80">
          {sessionDetails.map((detail, index) => (
            <div key={detail.label} className="flex">
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
            <div className="bg-slate-500 rounded-md m-2">
              <input
                type="file"
                accept=".xlsx"
                placeholder="Upload Excel File"
                className="bg-slate-300 rounded-l-md px-2 py-1 font-semibold"
                ref={fileInputRef}
              />
              <button
                className="text-white px-2 font-semibold hover:cursor-pointer"
                onClick={handleUploadExcel}
              >
                Upload Excel
              </button>
            </div>
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
