import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllClassRecords, handleDelete } from "@api/class-record-api";
import SearchBox from "@components/shared/SearchBox";
import { ClassRecord } from "shared-library/dist/types";
import { FeedbackMessage } from "@components/shared/FeedbackMessage";
import { GeneratePDFContent } from "@utils/handle-pdf";
import { formatTo12HourTime } from "@utils/constants";
import EditRecordModal from "@components/class-record/EditRecordModal";
import { FM } from "shared-library";
import { filterSearchQuery } from "@helpers/search-functions";

export const ClassRecords = () => {
  const [records, setRecords] = useState<ClassRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<ClassRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<ClassRecord>();
  const [searchQuery, setSearchQuery] = useState("");
  const [editModal, setEditModal] = useState(false)
  const [viewRecord, setViewRecord] = useState(false)
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllClassRecords = async () => {
      try {
        setRecords(await getAllClassRecords());
        setSuccess(FM.successFetchingData)
        setTimeout(() => setSuccess(''), 2000)
      } catch (error) {
        setError(FM.errorFetchingData)
        console.log(error)
        setTimeout(() => setError(''), 2000)
      }
    };

    fetchAllClassRecords();
  }, []);

  useEffect(() => {
    const filteredRecords = filterSearchQuery<ClassRecord>(searchQuery, records, [
      "classroom",
      "classId",
      "course",
      "date",
      "lecturer",
      "startTime",
      "status",
    ])
    setFilteredRecords(filteredRecords)

    return () => setFilteredRecords([])
  }, [records, searchQuery]);

  const handleDownloadPDF = async (_id?: string) => {
    const selectedRecord = records.find((record) => record?._id! === _id);

    if (selectedRecord) {
      setSelectedRecord(selectedRecord);
      setEditModal(false)
      setViewRecord(true)
    }
  };

  const handleEditModel = async (_id: string | undefined) => {
    setEditModal(true)
    const selectedRecord = records.find((record) => (record?._id!) === _id);
    
    if (selectedRecord) {
      setSelectedRecord(selectedRecord);
      setEditModal(true)
      setViewRecord(false)
    }
  };

  async function _handleDeleteRecord(_id: string | undefined) {
    await handleDelete(_id!, "class-record")
    setRecords(await getAllClassRecords())
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
        {filteredRecords?.map((record) => (
          <div key={record?._id!} className="flex px-4 py-2 justify-evenly">
            <p className="w-3/12">
              {new Date(record?.date!).toLocaleDateString('en-GB')} , {formatTo12HourTime(record?.startTime!)}
            </p>
            <p className="w-4/12">{record?.course}</p>
            <p className="w-3/12">{record?.lecturer}</p>
            <div className="w-2/12">
              <button
                className="bg-orange-300 px-3 py-1"
                onClick={() => handleDownloadPDF(record?._id!)}
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
                onClick={() => _handleDeleteRecord(record?._id!)}
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

      <EditRecordModal
        isActive={editModal}
        setIsActive={setEditModal}
        record={selectedRecord}
      />
    </div>
  );
};

export default ClassRecords;
