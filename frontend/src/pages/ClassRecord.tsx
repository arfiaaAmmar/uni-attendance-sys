import { useEffect, useState } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { getAllClassRecords } from "../api/classRecordApi";
import { Link } from "react-router-dom";
import SearchBox from "../components/SearchBox";
import { GeneratePDFContent } from "../utils/pdfHandlers";
import { IClassRecord } from "backend/src/model/model";

export const ClassRecords = () => {
  const [records, setRecords] = useState<IClassRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [filteredRecord, setFilteredRecord] = useState<
    IClassRecord[] | undefined
  >();
  const [selectedRecord, setSelectedRecord] = useState<
    IClassRecord | undefined
  >();
  const [actionModal, setActionModal] = useState({
    editRecordModal: false,
    viewRecordModal: false,
    printRecord: false,
  });

  const [manualAttendance, setManualAttendance] = useState({
    studentName: "",
    studentId: "",
    attendanceTime: "",
  });

  const handleDownloadPDF = async (_id: string) => {
    const selectedRecord = records.find((record) => record.classId === _id);

    if (selectedRecord) {
      setSelectedRecord(selectedRecord);
      setActionModal({
      editRecordModal: false,
      viewRecordModal: true,
      printRecord: false,
    });
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
          const propertyValue = record[prop as keyof IClassRecord];

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
        {filteredRecord?.map((record, index) => (
          <div key={index} className="flex px-4 py-2 justify-evenly">
            <p className="w-3/12">
              {record.date} {record?.startTime}
            </p>
            <p className="w-4/12">{record?.course}</p>
            <p className="w-3/12">{record?.lecturer}</p>
            <div className="w-2/12">
              <PDFDownloadLink
                document={
                  <GeneratePDFContent selectedRecord={selectedRecord} />
                }
                fileName="my_pdf.pdf"
                className="bg-blue-300  px-3 py-1"
                // onClick={() => handleDownloadPDF(record?.classId)}
              >
                {({ loading }) => (loading ? "Loading..." : "Download PDF")}
              </PDFDownloadLink>
              <button className="bg-green-300 px-3 py-1">Edit</button>
              <button className="bg-yellow-100 px-3 py-1">Print</button>
              <button
                className="bg-orange-300 px-3 py-1"
                onClick={() => handleDownloadPDF(record.classId)}
              >
                View
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
      {actionModal.editRecordModal && (
        <div>
          <h1>Edit Record</h1>
          <button
            onClick={() =>
              setActionModal({ ...actionModal, editRecordModal: false })
            }
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassRecords;
