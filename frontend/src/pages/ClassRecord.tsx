import React, { useEffect, useState } from "react";
import { ClassRecord as ClassRecordType } from "../types/types";
import { StyleSheet, PDFViewer, Document, Text, Page, View, PDFDownloadLink } from '@react-pdf/renderer';
import { getAllClassRecords } from "../api/classRecordApi";
import { Link } from "react-router-dom";
import SearchBox from "../components/SearchBox";

export const ClassRecord = () => {
  const [records, setRecords] = useState<ClassRecordType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [filteredRecord, setFilteredRecord] = useState<
    ClassRecordType[] | undefined
  >();
  const [selectedRecord, setSelectedRecord] = useState<ClassRecordType | undefined>();
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

  const styles = StyleSheet.create({
    container: {
      flexDirection: "column",
      width: "100%",
      height: "100%",
      backgroundColor: "white",
    },
    heading: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    tableHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      backgroundColor: "#f0f0f0",
      padding: 5,
      marginTop: 10,
    },
    columnHeader: {
      fontWeight: "bold",
      flex: 1,
      textAlign: "center",
    },
    tableRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      backgroundColor: "#f5f5f5",
      padding: 5,
    },
    cell: {
      flex: 1,
      textAlign: "center",
    },
  });

  const ClassRecordPDF = ({ selectedRecord}:{selectedRecord: ClassRecordType | undefined}) => (
    <PDFViewer>
      <Document>
        <Page>
          <View style={styles.container}>
            <Text style={styles.heading}>Class Record</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.cell, styles.columnHeader]}>No.</Text>
              <Text style={[styles.cell, styles.columnHeader]}>Full Name</Text>
              <Text style={[styles.cell, styles.columnHeader]}>Student ID</Text>
              <Text style={[styles.cell, styles.columnHeader]}>Status</Text>
            </View>
            <View
              style={{
                height: "30vh",
                backgroundColor: "#f0f0f0",
              }}
            >
              {selectedRecord?.attendance?.map((attendance, index) => (
                <View key={attendance.studentId} style={styles.tableRow}>
                  <Text style={styles.cell}>{index + 1}</Text>
                  <Text style={styles.cell}>{attendance.studentName}</Text>
                  <Text style={styles.cell}>{attendance.studentId}</Text>
                  <Text style={styles.cell}>{attendance.attendanceTime}</Text>
                </View>
              ))}
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );

  const handleDownloadPDF = async (_id: string) => {
    const selectedRecord = records.find((record) => record.classId === _id);

    if (selectedRecord) {
      setSelectedRecord(selectedRecord);
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
          const propertyValue = record[prop as keyof ClassRecordType];

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
                document={<ClassRecordPDF selectedRecord={selectedRecord}/>}
                fileName="my_pdf.pdf"
                className="bg-blue-300  px-3 py-1"
                // onClick={() => handleDownloadPDF(record?.classId)}
              >
                {({ loading }) => (loading ? "Loading..." : "Download PDF")}
              </PDFDownloadLink>
              <button className="bg-green-300 px-3 py-1">Edit</button>
              <button className="bg-yellow-100 px-3 py-1">Print</button>
              <button className="bg-orange-300 px-3 py-1">View</button>
            </div>
          </div>
        ))}
      </div>

      {actionModal.viewRecordModal && (
        <div>
          <ClassRecordPDF selectedRecord={selectedRecord} />
          <button
            onClick={() =>
              setActionModal({ ...actionModal, viewRecordModal: false })
            }
          >
            Close
          </button>
          <PDFDownloadLink document={<ClassRecordPDF selectedRecord={selectedRecord}/>} fileName="my_pdf.pdf">
            {({ blob, url, loading, error }) => {
              // Set pdfLoading based on the loading state
              if (loading) {
                setPdfLoading(true);
              } else {
                setPdfLoading(false);
              }

              // Display appropriate text based on pdfLoading and url
              if (pdfLoading) {
                return "Loading...";
              } else if (url) {
                return "Download PDF";
              } else {
                return "Error";
              }
            }}
          </PDFDownloadLink>
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

export default ClassRecord;
