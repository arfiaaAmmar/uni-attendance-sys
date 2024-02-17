import { useState, useEffect, FormEvent } from 'react';
import { handleDelete, updateClassRecord } from '@api/class-record-api';
import SearchBox from '@components/shared/SearchBox';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { GeneratePDFContent } from '@utils/handle-pdf';
import { defAttendanceFormState, formatTo12HourTime } from '@utils/constants';
import { FM } from 'shared-library';
import { Attendance, ClassRecord, ModalActivationProps } from 'shared-library';
import { FeedbackMessage } from '@components/shared/FeedbackMessage';
import { checkAttendanceStatus } from '@helpers/shared-helpers';
import ManualAttendance from '@components/class-session/ManualAttendance';
import { filterSearchQuery } from '@helpers/search-functions';

interface EditRecordModalProps extends ModalActivationProps {
  record: ClassRecord | undefined
}

const EditRecordModal = ({ isActive, setIsActive, record }: EditRecordModalProps) => {
  const [filteredAttendees, setFilteredAttendees] = useState<Attendance[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [manualAttendance, setManualAttendance] = useState(false)
  const [manualAttendanceForm, setManualAttendanceForm] = useState<Attendance>(defAttendanceFormState)
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  console.log('tyjitkj', record?.attendance!)
  const handleUpdateRecord = () => {

  }

  useEffect(() => {
    const filteredAttendees = filterSearchQuery<Attendance>(searchQuery, record?.attendance!, [
      "studentName",
      "studentId",
    ])
    setFilteredAttendees(filteredAttendees)

    return () => setFilteredAttendees([])
  }, [record?.attendance, searchQuery])

  async function _handletAttendanceDelete(_id: string | undefined) {
    await handleDelete(_id, "student")
  }

  async function handleManualAttendanceSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      const isStudentExist = record?.attendance?.some(
        (attendance) => attendance?.studentId === manualAttendanceForm?.studentId
      );
      if (isStudentExist) {
        setError(FM.studentExist);
        return;
      }

      const param: Attendance[] = [{
        studentName: manualAttendanceForm?.studentName!,
        studentId: manualAttendanceForm?.studentId!,
        attendanceTime: new Date().toISOString(),
      }]
      await updateClassRecord(record?._id!, { attendance: param });

      // Reset all
      setManualAttendanceForm(defAttendanceFormState);
      setManualAttendance(false);
      setSuccess(FM.addingAttendanceSuccess)
      setTimeout(() => { setSuccess('') }, 2000)
    } catch (error) {
      console.error(FM.errorUpdatingClassRecord, error);
      setError(FM.addingAttendanceFailed)
      setTimeout(() => setError(''), 2000)
    }
  }

  const handleAttendanceStatus = (arrivalTime: string) => {
    if (!(record)) return
    const { startTime, endTime } = record
    return checkAttendanceStatus(startTime!, endTime!, arrivalTime)
  }

  if (!(isActive)) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md p-8 w-5/6 h-5/6 relative">
        <h1 className="text-2xl font-bold my-2">Edit Record</h1>
        <SearchBox query={searchQuery} onChange={setSearchQuery} />
        <FeedbackMessage {...{ success, error }} />
        <div className="flex justify-between">
          <div className="bg-neutral-400 rounded-md p-4 mt-4 mb-0 w-80">
            {[
              { label: 'Class', value: record?.classroom },
              { label: 'Course', value: record?.course },
              { label: 'Date', value: new Date(record?.date!).toLocaleDateString('en-GB') },
              { label: 'Start Time', value: formatTo12HourTime(record?.startTime!) },
              { label: 'End Time', value: formatTo12HourTime(record?.endTime!) },
              { label: 'Status', value: record?.status },
            ].map((info, index) => (
              <div key={info?.label + 1} className="flex">
                <p className="font-semibold w-1/3">{info.label}</p>
                <p className="w-2/3">: {info.value}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-auto mb-0">
            <div>
              <button className="bg-purple-400 rounded-md py-2 px-2 mr-2" onClick={() => setManualAttendance(true)}>
                Manual Attendance
              </button>
              <ManualAttendance
                isActive={manualAttendance}
                form={manualAttendanceForm}
                setForm={setManualAttendanceForm}
                setIsActive={setManualAttendance}
                handleSubmit={handleManualAttendanceSubmit}
              />
              <PDFDownloadLink
                className="bg-yellow-600 rounded-md py-2 px-2"
                document={<GeneratePDFContent selectedRecord={record!} />}
                fileName="class_record?.pdf"
              >
                {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
              </PDFDownloadLink>
            </div>
          </div>
        </div>
        <div className="bg-neutral-400 flex px-4 py-2 justify-evenly h-14 mt-4">
          {['No.', 'Full Name', 'Student ID', 'Status'].map((label, index) => (
            <p key={label} className={`font-semibold w-${index === 0 ? '1/12' : index === 1 ? '5/12' : '3/12'}`}>{label}</p>
          ))}
        </div>
        <div className="bg-neutral-200 h-[30vh] overflow-y-auto">
          {filteredAttendees?.map((student, index) => (
            <div key={`${student?.studentId}-${index + 1}`} className="flex px-4 py-1 justify-evenly">
              <p className="w-1/12">{index + 1}</p>
              <p className="w-5/12">{student?.studentName}</p>
              <p className="w-3/12">{student?.studentId}</p>
              <p className="w-1/12">{student?.attendanceTime ? handleAttendanceStatus(student?.attendanceTime!) : 'N/A'}</p>
            </div>
          ))}
        </div>
        <div className="absolute bottom-2 right-2 flex gap-2">
          <button className="bg-red-400 px-2 py-1 rounded-md " onClick={() => setIsActive(false)}>
            Close
          </button>
          <button className="bg-green-400 px-2 py-1 rounded-md" onClick={() => handleUpdateRecord()}>
            Update Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRecordModal;
