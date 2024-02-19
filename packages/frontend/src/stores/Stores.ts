import { atom, useAtom } from "jotai";
import { Attendance, ClassRecord } from "shared-library/dist/types";

const recordsAtom = atom<ClassRecord[] | undefined>(undefined)
const recordAtom = atom<ClassRecord | undefined>(undefined)
const attendanceFormDataAtom = atom<Attendance | undefined>(undefined)

export const useClassRecordStore = () => {
    const [records, setRecords] = useAtom(recordsAtom)
    const [selectedRecord, setSelectedRecord] = useAtom(recordAtom)
    const [attendanceFormData, setAttendanceFormData] = useAtom(attendanceFormDataAtom)

    return {
        records, setRecords,
        selectedRecord, setSelectedRecord,
        attendanceFormData, setAttendanceFormData,
    }
}
