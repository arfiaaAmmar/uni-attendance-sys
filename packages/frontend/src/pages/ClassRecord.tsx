import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getAllClassRecords } from "../api/class-record-api";
import SearchBox from "../components/SearchBox";
import { GeneratePDFContent } from "../utils/handle-pdf";
import { Avatar, Button } from "@mui/material";
import { ClassRecord } from "packages/shared-library/src/types";
import { defFeedback } from "packages/shared-library/src/constants";

export const ClassRecords = () => {
  const [records, setRecords] = useState<ClassRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [filteredRecord, setFilteredRecord] = useState<ClassRecord[]>();
  const [selectedRecord, setSelectedRecord] = useState<ClassRecord>();
  const [updatedRecord, setUpdatedRecord] = useState<ClassRecord>();
  const [actionModal, setActionModal] = useState({
    editRecordModal: false,
    viewRecordModal: false,
    printRecord: false,
    manualAttendance: false,
  });
  const [feedback, setFeedback] = useState(defFeedback);

  const [manualAttendanceInput, setManualAttendanceInput] = useState({
    studentName: "",
    studentId: "",
    attendanceTime: "",
  });

  const handleDownloadPDF = async (_id?: string) => {
    const selectedRecord = records.find((record) => record._id === _id);

    if (selectedRecord) {
      setSelectedRecord(selectedRecord);
      setActionModal({
        editRecordModal: false,
        viewRecordModal: true,
        printRecord: false,
        manualAttendance: false,
      });
    }
  };

  const handleEditModel = async (_id?: string) => {
    setActionModal({ ...actionModal, editRecordModal: true });
    const selectedRecord = records.find((record) => record._id);

    if (selectedRecord) {
      setSelectedRecord(selectedRecord);
      setActionModal({
        editRecordModal: true,
        viewRecordModal: false,
        printRecord: false,
        manualAttendance: false,
      });
    }
  };

  const handleUpdateRecord = async (classId: string) => {
    try {
      setUpdatedRecord(updatedRecord);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const handleSubmitManualAttendance = async () => {};

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

  return (
    <div className="m-4">
      <h3 className="text-3xl font-bold">
        <Link to="/admin/attendance_system">Attendance System</Link> {">"} Class
        Records
      </h3>
      <p>To view, download, edit and print past class sessions.</p>
      <SearchBox query={searchQuery} onChange={setSearchQuery} />
      <div className="bg-neutral-400 flex px-4 py-2 justify-evenly h-14 mt-4">
        <p className="font-semibold w-3/12">Date & Time</p>
        <p className="font-semibold w-4/12">Subject</p>
        <p className="font-semibold w-3/12">Lecturer</p>
        <p className="font-semibold w-2/12">Action</p>
      </div>
      <div className="bg-neutral-200 h-[70vh] overflow-y-auto">
        {filteredRecord?.map((record) => (
          <div key={record._id} className="flex px-4 py-2 justify-evenly">
            <p className="w-3/12">
              {record.date} {record?.startTime}
            </p>
            <p className="w-4/12">{record?.course}</p>
            <p className="w-3/12">{record?.lecturer}</p>
            <div className="w-2/12">
              <button
                className="bg-orange-300 px-3 py-1"
                onClick={() => handleDownloadPDF(record._id)}
              >
                View | Download
              </button>
              <button
                className="bg-green-300 px-3 py-1"
                onClick={() => handleEditModel(record._id)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
      {actionModal.viewRecordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md p-8 w-full h-full">
            <PDFViewer width="100%" height="100%">
              <GeneratePDFContent selectedRecord={selectedRecord} />
            </PDFViewer>
            <button
              className="bg-red-400 mx-2 my-1 rounded-md"
              onClick={() =>
                setActionModal({ ...actionModal, viewRecordModal: false })
              }
            >
              Close
            </button>
            <PDFDownloadLink
              className="bg-green-400 mx-2 my-1 rounded-md"
              document={<GeneratePDFContent selectedRecord={selectedRecord} />}
              fileName="class_record.pdf"
            >
              {({ loading }) =>
                loading ? "Loading document..." : "Download now!"
              }
            </PDFDownloadLink>
          </div>
        </div>
      )}
      {actionModal.manualAttendance && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-md p-8 flex gap-8">
            <div className="">
              <p className="text-lg mb-4">Start Class</p>
              {typeof feedback.error === "string" ? (
                <p className="text-red-500 font-bold">{feedback.error}</p>
              ) : feedback.success ? (
                <p className="text-green-600 font-bold">{feedback.success}</p>
              ) : null}
              <form>
                <p>Seach Student Name</p>
                <SearchBox
                  placeholder="Seach name / matrik"
                  query={searchQuery}
                  onChange={setSearchQuery}
                />
                <div className="flex justify-between mt-4">
                  <Button
                    onClick={() => handleSubmitManualAttendance}
                    variant="contained"
                    className="bg-green-600 text-white font-bold"
                    type="submit"
                  >
                    Submit
                  </Button>
                  <Button
                    onClick={() =>
                      setActionModal({
                        ...actionModal,
                        manualAttendance: false,
                      })
                    }
                    variant="outlined"
                    className="text-gray-600"
                  >
                    Close
                  </Button>
                </div>
              </form>
            </div>
            <div>
              <Avatar
                style={{ width: "100px", height: "100px" }}
                className="mx-auto mb-4"
              />
              <p className="text-sm text-gr">Student Name</p>
              <p className="text-xl">Ammar Hazim</p>
              <p className="text-sm">Student Id </p>
              <p className="text-xl">193850183579183</p>
              <p className="text-sm">Course</p>
              <p className="text-xl">IT</p>
            </div>
          </div>
        </div>
      )}
      {actionModal.editRecordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md p-8 w-5/6 h-5/6 relative">
            <h1 className="text-2xl font-bold my-2">Edit Record</h1>
            <SearchBox
              query={searchQuery}
              onChange={setSearchQuery}
            />
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
                  <p className="w-2/3">: {selectedRecord?.date}</p>
                </div>
                <div className="flex">
                  <p className="font-semibold w-1/3">Start Time</p>
                  <p className="w-2/3">: {selectedRecord?.startTime}</p>
                </div>
                <div className="flex">
                  <p className="font-semibold w-1/3">End Time</p>
                  <p className="w-2/3 ">: {selectedRecord?.endTime}</p>
                </div>
              </div>
              <div className="flex justify-between mt-auto mb-0">
                <div>
                  <button
                    className="bg-purple-400 rounded-md py-2 px-2 mr-2"
                    onClick={() =>
                      setActionModal({ ...actionModal, manualAttendance: true })
                    }
                  >
                    Manual Attendance
                  </button>
                  <PDFDownloadLink
                    className="bg-yellow-600 rounded-md py-2 px-2"
                    document={
                      <GeneratePDFContent selectedRecord={selectedRecord} />
                    }
                    fileName="class_record.pdf"
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
            </div>
            <div className="bg-neutral-200 h-[30vh] overflow-y-auto">
              {selectedRecord?.attendance?.map((student, index) => (
                <div
                  key={student.studentId}
                  className="flex px-4 py-1 justify-evenly"
                >
                  <p className="w-1/12">{index + 1}</p>
                  <p className="w-5/12">{student.studentName}</p>
                  <p className="w-3/12">{student.studentId}</p>
                  <p className="w-1/12"> Next time </p>
                </div>
              ))}
            </div>
            <div className="absolute bottom-2 right-2 flex gap-2">
              <button
                className="bg-red-400 px-2 py-1 rounded-md "
                onClick={() =>
                  setActionModal({ ...actionModal, editRecordModal: false })
                }
              >
                Close
              </button>
              <button
                className="bg-green-400 px-2 py-1 rounded-md"
                onClick={() => handleUpdateRecord(selectedRecord?._id!)}
              >
                Update Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassRecords;
