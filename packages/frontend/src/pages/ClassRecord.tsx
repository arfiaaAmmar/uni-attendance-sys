import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getAllClassRecords, handleDelete, updateClassRecord } from "@api/class-record-api";
import SearchBox from "@components/shared/SearchBox";
import { ClassRecord } from "shared-library/dist/types";
import { FeedbackMessage } from "@components/shared/FeedbackMessage";
import { GeneratePDFContent } from "@utils/handle-pdf";
import { formatTo12HourTime } from "@utils/constants";
import ManualAttendance from "@components/class-session/ManualAttendance";
import moment from "moment";
import { FM } from "shared-library";

export const ClassRecords = () => {
  // Initial load
  const [records, setRecords] = useState<ClassRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecord, setFilteredRecord] = useState<ClassRecord[]>();
  const [selectedRecord, setSelectedRecord] = useState<ClassRecord>();
  const [updatedRecordData, setUpdateRecordData] = useState<Partial<ClassRecord>>()
  // Modals
  const [manualAttendance, setManualAttendance] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [viewRecord, setViewRecord] = useState(false)
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleDownloadPDF = async (_id?: string) => {
    const selectedRecord = records.find((record) => record?._id === _id);

    if (selectedRecord) {
      setSelectedRecord(selectedRecord);
      setEditModal(false)
      setViewRecord(true)
      setManualAttendance(false)
    }
  };

  const handleEditModel = async (_id?: string) => {
    setEditModal(true)
    const selectedRecord = records.find((record) => record?._id);

    if (selectedRecord) {
      setSelectedRecord(selectedRecord);
      setEditModal(true)
      setViewRecord(false)
      setManualAttendance(false)
    }
  };

  useEffect(() => {
    const fetchAllClassRecords = async () => {
      const data = await getAllClassRecords();
      setRecords(data);
    };

    fetchAllClassRecords();
  }, []);

  useEffect(() => {
    if (records) {
      const filteredList = records.filter((record) =>
        [
          "lecturer",
          "course",
          "classroom",
          "date",
          "startTime",
          "endTime",
        ].some((prop) => {
          const propertyValue = record[prop as keyof ClassRecord];

          if (propertyValue === null || propertyValue === undefined) {
            return false; // Skip filtering for null or undefined values
          }

          if (Array.isArray(propertyValue)) {
            return propertyValue.some((attendance) =>
              attendance.studentName
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            );
          } else {
            return propertyValue
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
          }
        })
      );
      setFilteredRecord(filteredList);
    }
  }, [records, searchQuery]);

  function isLate(arrivalTime: string) {
    const startTime = moment(selectedRecord?.startTime);
    const endTime = moment(selectedRecord?.endTime);
    const _arrivalTime = moment(arrivalTime);

    if (!_arrivalTime.isValid()) return 'MIA';
    if (_arrivalTime.isAfter(endTime)) return 'Manual';

    const timeDifference = _arrivalTime.diff(startTime, 'minutes');
    if (timeDifference > 0) return 'Late';
    else return 'On Time';
  }

  // async function handleUpdateRecord() {
  //   try {
  //     const params: Partial<ClassRecord> = {
  //       attendance: [
          
  //       ]
  //     }
  //     await updateClassRecord(selectedRecord?._id!, {...updatedRecordData})
  //   } catch (error) {
  //     setError(FM.classRecordUpdateFailed)
  //     console.error("Error fetching user list:", error);
  //   }
  // }

  async function _handleDelete(_id: string | undefined){
    await handleDelete(_id, "class-record")
    setRecords(await getAllClassRecords())
  }

  async function _handletAttendanceDelete(_id: string | undefined){
    await handleDelete(_id, "student")
  }

  return (
    <div className="m-4">
      <h3 className="text-3xl font-bold">
        <Link to="/admin/attendance_system">Attendance System</Link> {">"} Class
        Records
      </h3>
      <p>To view, download, edit and print past class sessions.</p>
      <SearchBox query={searchQuery} onChange={setSearchQuery} />
      <FeedbackMessage success={success} error={error} />
      <div className="bg-neutral-400 flex px-4 py-2 justify-evenly h-14 mt-4">
        <p className="font-semibold w-3/12">Date & Time</p>
        <p className="font-semibold w-4/12">Subject</p>
        <p className="font-semibold w-3/12">Lecturer</p>
        <p className="font-semibold w-2/12">Action</p>
      </div>
      <div className="bg-neutral-200 h-[70vh] overflow-y-auto">
        {filteredRecord?.map((record) => (
          <div key={record?._id} className="flex px-4 py-2 justify-evenly">
            <p className="w-3/12">
              {new Date(record?.date!).toLocaleDateString('en-GB')} , {formatTo12HourTime(record?.startTime!)}
            </p>
            <p className="w-4/12">{record?.course}</p>
            <p className="w-3/12">{record?.lecturer}</p>
            <div className="w-2/12">
              <button
                className="bg-orange-300 px-3 py-1"
                onClick={() => handleDownloadPDF(record?._id)}
              >
                View | Download
              </button>
              <button
                className="bg-green-300 px-3 py-1"
                onClick={() => handleEditModel(record?._id)}
              >
                Edit
              </button>
              <button
                className="bg-red-300 px-3 py-1"
                onClick={() => _handleDelete(record?._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {viewRecord && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md p-8 w-full h-full">
            <PDFViewer width="100%" height="100%">
              <GeneratePDFContent selectedRecord={selectedRecord} />
            </PDFViewer>
            <button
              className="bg-red-400 mx-2 my-1 rounded-md"
              onClick={() => setViewRecord(false)}
            >
              Close
            </button>
            <PDFDownloadLink
              className="bg-green-400 mx-2 my-1 rounded-md"
              document={<GeneratePDFContent selectedRecord={selectedRecord} />}
              fileName="class_record?.pdf"
            >
              {({ loading }) =>
                loading ? "Loading document..." : "Download now!"
              }
            </PDFDownloadLink>
          </div>
        </div>
      )}

      <ManualAttendance classId={selectedRecord?.classId} isActive={manualAttendance} setIsActive={setManualAttendance} />
      {editModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md p-8 w-5/6 h-5/6 relative">
            <h1 className="text-2xl font-bold my-2">Edit Record</h1>
            <SearchBox query={searchQuery} onChange={setSearchQuery} />
            <div className="flex justify-between">
              <div className="bg-neutral-400 rounded-md p-4 mt-4 mb-0 w-80">
                <div className="flex">
                  <p className="font-semibold w-1/3">Class </p>
                  <p className="w-2/3">: {selectedRecord?.classroom}</p>
                </div>
                <div className="flex">
                  <p className="font-semibold w-1/3">Course </p>
                  <p className="w-2/3">: {selectedRecord?.course}</p>
                </div>
                <div className="flex">
                  <p className="font-semibold w-1/3">Date </p>
                  <p className="w-2/3">: {new Date(selectedRecord?.date!).toLocaleDateString('en-GB')}</p>
                </div>
                <div className="flex">
                  <p className="font-semibold w-1/3">Start Time</p>
                  <p className="w-2/3">: {formatTo12HourTime(selectedRecord?.startTime!)}</p>
                </div>
                <div className="flex">
                  <p className="font-semibold w-1/3">End Time</p>
                  <p className="w-2/3 ">: {formatTo12HourTime(selectedRecord?.endTime!)}</p>
                </div>
                <div className="flex">
                  <p className="font-semibold w-1/3">Status</p>
                  <p className="w-2/3 ">: {selectedRecord?.status}</p>
                </div>
              </div>
              <div className="flex justify-between mt-auto mb-0">
                <div>
                  <button
                    className="bg-purple-400 rounded-md py-2 px-2 mr-2"
                    onClick={() => setManualAttendance(true)}
                  >
                    Manual Attendance
                  </button>
                  <PDFDownloadLink
                    className="bg-yellow-600 rounded-md py-2 px-2"
                    document={
                      <GeneratePDFContent selectedRecord={selectedRecord} />
                    }
                    fileName="class_record?.pdf"
                  >
                    {({ loading }) =>
                      loading ? "Loading document..." : "Download PDF"
                    }
                  </PDFDownloadLink>
                </div>
              </div>
            </div>
            <div className="bg-neutral-400 flex px-4 py-2 justify-evenly h-14 mt-4">
              <p className="font-semibold w-1/12 ">No.</p>
              <p className="font-semibold w-5/12">Full Name</p>
              <p className="font-semibold w-3/12">Student ID</p>
              <p className="font-semibold w-1/12">Status</p>
              {/* <p className="font-semibold w-1/12">Delete</p> */}
            </div>
            <div className="bg-neutral-200 h-[30vh] overflow-y-auto">
              {selectedRecord?.attendance?.map((student, index) => (
                <div
                  key={student?.studentId}
                  className="flex px-4 py-1 justify-evenly"
                >
                  <p className="w-1/12">{index + 1}</p>
                  <p className="w-5/12">{student?.studentName}</p>
                  <p className="w-3/12">{student?.studentId}</p>
                  <p className="w-1/12">{isLate(student?.attendanceTime!)}</p>
                  {/* <p className="w-1/12 text-red-500" onClick={() => _handleAttendanceDelete(student?._id)}>Delete</p> */}
                </div>
              ))}
            </div>
            <div className="absolute bottom-2 right-2 flex gap-2">
              <button
                className="bg-red-400 px-2 py-1 rounded-md "
                onClick={() => setEditModal(false)}
              >
                Close
              </button>
              {/* <button
                className="bg-green-400 px-2 py-1 rounded-md"
                onClick={() => handleUpdateRecord()}
              >
                Update Record
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassRecords;
