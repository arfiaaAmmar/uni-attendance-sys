import {
  Page,
  View,
  Text,
  Document,
  StyleSheet
} from "@react-pdf/renderer";
import { ClassRecord } from "shared-library/dist/types";
import moment from "moment";
import { formatTo12HourTime } from "./constants";

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
    flex: 1,
    fontSize: 14,
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
    fontSize: 12
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
  }
});

type GeneratePDFContentProps = {
  selectedRecord: ClassRecord | undefined;
};

export const GeneratePDFContent = ({
  selectedRecord,
}: GeneratePDFContentProps) => {
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
            {selectedRecord?.attendance?.map((attendee, index) => (
              <View key={attendee.studentId} style={styles.tableRow}>
                <Text style={styles.cell}>{index + 1}</Text>
                <Text style={styles.cell}>{attendee.studentName}</Text>
                <Text style={styles.cell}>{attendee.studentId}</Text>
                <Text style={styles.cell}>{formatTo12HourTime(attendee?.attendanceTime!)}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

