import {
  Page,
  View,
  Text,
  Document,
  StyleSheet
} from "@react-pdf/renderer";
import { ClassRecord } from "shared-library/dist/types";
import { formatTo12HourTime } from "./constants";
import { checkAttendanceStatus } from "@helpers/shared-helpers";

//make this for Attendance Report first then afterwards make it generic
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: "20pt",
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  heading: {
    fontSize: 14,
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
    fontSize: 14,
    textAlign: "center",
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#f5f5f5",
    padding: 5,
  },
  cell: {
    textAlign: "left",
    fontSize: 12,
  },
  classInfo: {
    flexDirection: "column",
    backgroundColor: "#f0f0f0",
    padding: 5,
    width: '50%',
    marginBottom: 20,
  },
  classInfoItem: {
    fontSize: 12,
    marginBottom: 5,
  },
  classInfoDivider: {
    backgroundColor: "#dddddd",
    height: 1,
    marginVertical: 5,
  },
  noCell: {
    flex: 0.5,
  },
  nameCell: {
    flex: 2,
  },
  matrikCell: {
    flex: 2,
  },
  timeCell: {
    flex: 1,
  },
  statusCell: {
    flex: 0.5,
  },
});

type GeneratePDFContentProps = {
  selectedRecord: ClassRecord | undefined;
};

export const GeneratePDFContent = ({
  selectedRecord,
}: GeneratePDFContentProps) => {
  function handleAttendanceStatus(arrivalTime: string) {
    if (!(selectedRecord)) return
    const { startTime, endTime } = selectedRecord
    return checkAttendanceStatus(startTime!, endTime!, arrivalTime)
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Class Information Section */}
          <Text style={styles.documentTitle}>Class Information</Text>
          <Text style={styles.heading}>Class Information</Text>
          <View style={styles.classInfo}>
            <Text style={styles.classInfoItem}>
              Lecturer: {selectedRecord?.lecturer}
            </Text>
            <Text style={styles.classInfoDivider}></Text>
            <Text style={styles.classInfoItem}>
              Classroom: {selectedRecord?.classroom}
            </Text>
            <Text style={styles.classInfoDivider}></Text>
            <Text style={styles.classInfoItem}>
              Date: {new Date(selectedRecord?.date!).toLocaleDateString('en-GB')}
            </Text>
            <Text style={styles.classInfoDivider}></Text>
            <Text style={styles.classInfoItem}>
              Start Time: {formatTo12HourTime(selectedRecord?.startTime!)}
            </Text>
            <Text style={styles.classInfoDivider}></Text>
            <Text style={styles.classInfoItem}>
              End Time: {formatTo12HourTime(selectedRecord?.endTime!)}
            </Text>
          </View>

          {/* Attendance Table */}
          <Text style={styles.heading}>Class Record</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.noCell]}>No.</Text>
            <Text style={[styles.cell, styles.nameCell]}>Student Name</Text>
            <Text style={[styles.cell, styles.matrikCell]}>Matrik</Text>
            <Text style={[styles.cell, styles.timeCell]}>Time Arrived</Text>
            <Text style={[styles.cell, styles.statusCell]}>Status</Text>
          </View>
          <View
            style={{
              height: "30vh",
              backgroundColor: "#f0f0f0",
            }}
          >
            {selectedRecord?.attendance?.map((attendee, index) => (
              <View key={attendee.studentId} style={styles.tableRow}>
                <Text style={[styles.cell, styles.noCell]}>{index + 1}</Text>
                <Text style={[styles.cell, styles.nameCell]}>{attendee.studentName}</Text>
                <Text style={[styles.cell, styles.matrikCell]}>{attendee.studentId}</Text>
                <Text style={[styles.cell, styles.timeCell]}>{formatTo12HourTime(attendee?.attendanceTime!)}</Text>
                <Text style={[styles.cell, styles.statusCell]}>{handleAttendanceStatus(attendee?.attendanceTime!)}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

