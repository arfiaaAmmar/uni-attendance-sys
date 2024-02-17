import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getClassRecord,
  getLocalClassSession, updateClassRecord
} from "@api/class-record-api";
import SearchBox from "@components/shared/SearchBox";
import { FM, PAGES_PATH, STORAGE_NAME } from "shared-library/dist/constants";
import { filterSearchQuery } from "@helpers/search-functions";
import { Attendance } from "shared-library/dist/types";
import ManualAttendance from "@components/class-session/ManualAttendance";
import InitialClassSessionForm from "@components/class-session/InitialClassSessionForm";
import { isEmpty } from "radash";
import { FeedbackMessage } from "@components/shared/FeedbackMessage";
import { defAttendanceFormState, formatTo12HourTime } from "@utils/constants";
import { handleClassRecordAttendanceExcelUpload } from "@utils/upload-excel";
import moment from "moment";
import { checkAttendanceStatus } from "@helpers/shared-helpers";

const ClassSession = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [filteredAttendance, setFilteredAttendance] = useState<Attendance[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [session, setSession] = useState(getLocalClassSession());
  const navigate = useNavigate();
  const [initialFormModal, setInitialFormModal] = useState(false);
  const [manualAttendanceModal, setManualAttendanceModal] = useState(false);
  const [manualAttendanceForm, setManualAttendanceForm] = useState<Attendance>(defAttendanceFormState)
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInitialData() {
      try {
        if (isEmpty(session)) setInitialFormModal(true);
        else {
          setInitialFormModal(false);
          const data = await getClassRecord(session?.classId);
          setAttendances(data?.attendance!);
          setSession({ ...data, status: "Ongoing" })
        }
      } catch (error) {
        setError(FM.errorFetchingData)
        console.error("Error fetching user list:", error);
      }
    }

    fetchInitialData()
  }, []);

  useEffect(() => {
    const filteredList = filterSearchQuery<Attendance>(searchQuery, attendances, [
      "studentName",
      "studentId",
      "attendanceTime"
    ]);
    setFilteredAttendance(filteredList);

    return () => setFilteredAttendance([])
  }, [attendances, searchQuery])

  async function handleUploadExcel() {
    if (fileInputRef?.current?.files) {
      const selectedFile = fileInputRef.current.files[0];

      if (selectedFile) {
        handleClassRecordAttendanceExcelUpload(session?.classId, selectedFile);
        setAttendances((await getClassRecord(session?.classId))?.attendance!)

        setSuccess(FM.excelUploadSuccess)
        setTimeout(() => setSuccess(""), 1000)
        navigate(PAGES_PATH.classSession)
      } else {
        setError("Error uploading excel")
        setTimeout(() => setError(""), 2000)
      }
    }
  };

  const changeSessionStatus = useCallback(() => {
    const currentTime = new Date().getTime();
    if (currentTime > new Date(session?.endTime!).getTime()) {
      setSession({ ...session, status: "Ended" });
    }
  }, [session?.endTime]);

  useEffect(() => {
    const interval = setInterval(() => changeSessionStatus(), 1000);

    return () => clearInterval(interval);
  }, [changeSessionStatus]);

  const handleEndClass = async () => {
    try {
      // Update class record to DB history before end class
      await updateClassRecord(session?.classId, { ...session, status: "Ended" })
      sessionStorage.removeItem(STORAGE_NAME.classSessionData)
      setSuccess(FM.classSessionEndedSuccessfully);
      setTimeout(() => {
        navigate(PAGES_PATH.classHistory);
      }, 2000);
    } catch (error) {
      setError(FM.errorEndingClass);
      console.error(error);
    }
  };

  const sessionDetails = [
    { label: "Class", value: session?.classroom },
    { label: "Course", value: session?.course },
    { label: "Lecturer", value: session?.lecturer },
    { label: "Date", value: new Date(session?.date!).toLocaleDateString('en-GB') || 'Not set' },
    { label: "Start Time", value: formatTo12HourTime(session?.startTime!) || 'Not set' },
    { label: "End Time", value: formatTo12HourTime(session?.endTime!) || 'Not set' },
    { label: "Status", value: getLocalClassSession()?.status! || 'Not started' }
  ];

  async function submitManualAttendance(event: FormEvent) {
    event.preventDefault();
    try {
      const isStudentExist = session?.attendance?.some(
        (attendance) => attendance?.studentId === manualAttendanceForm?.studentId
      );
      if (isStudentExist) {
        setError(FM.studentExist);
        return;
      }

      const _classId = session?.classId
      const param: Attendance[] = [{
        studentName: manualAttendanceForm?.studentName,
        studentId: manualAttendanceForm?.studentId,
        attendanceTime: new Date().toISOString(),
      }]
      await updateClassRecord(_classId, { attendance: param });

      // Reset all
      setManualAttendanceForm(defAttendanceFormState);
      setManualAttendanceModal(false);
      setSuccess(FM.addingAttendanceSuccess)
      setTimeout(() => { setSuccess('') }, 2000)
    } catch (error) {
      console.error(FM.errorUpdatingClassRecord, error);
      setError(FM.addingAttendanceFailed)
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
          {sessionDetails.map((detail) => (
            <div key={detail.label} className="flex">
              <p className="font-semibold w-1/3">{detail.label}</p>
              <p className='w-2/3'>: {detail.value}</p>
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
        <p className="font-semibold w-1/6">Time Arrived</p>
      </div>
      <div className="bg-neutral-200 h-[60vh] overflow-y-auto">
        {filteredAttendance?.map((student, index) => (
          <div
            key={student?._id!}
            className="flex px-4 py-2 justify-evenly h-14"
          >
            <p className="w-1/12 text-black">{index + 1}</p>
            <p className="w-5/12 text-black">{student.studentName}</p>
            <p className="w-3/12">{student.studentId}</p>
            <p className="font-semibold w-1/6">{checkAttendanceStatus(session?.startTime!, session?.endTime!, student?.attendanceTime!)}</p>
            <p className="font-semibold w-1/6">{formatTo12HourTime(student?.attendanceTime!)}</p>
          </div>
        ))}
      </div>
      <ManualAttendance
        isActive={manualAttendanceModal}
        form={manualAttendanceForm}
        setForm={setManualAttendanceForm}
        setIsActive={setManualAttendanceModal}
        handleSubmit={submitManualAttendance}
      />
      <InitialClassSessionForm
        isActive={initialFormModal}
        setIsActive={setInitialFormModal}
      />
    </div>
  );
};

export default ClassSession;
