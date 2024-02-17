import { getUserSessionData } from "@api/admin-api";
import { STORAGE_NAME } from "shared-library/dist/constants";
import { Attendance, ClassRecord } from "shared-library/dist/types";
import { defClassSessionState } from "utils/constants";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type OpenCloseModalState = {
    isActive: boolean;
    setIsActive: () => void;
}

const createOpenCloseModalSlice = () => create<OpenCloseModalState>(set => ({
    isActive: false,
    setIsActive: (value?: boolean) => set((state) => ({ isActive: value !== undefined ? value : !state.isActive })),
}));

const initialClassSessionFormSlice = createOpenCloseModalSlice()
const manualAttendanceSlice = createOpenCloseModalSlice()

// export const useClassSessionStore = create(persist<ClassRecord>((set) => (defaultClassSession),
//     {
//         name: STORAGE_NAME.classSessionData,
//         storage: createJSONStorage(() => sessionStorage)
//     }
// ));

type ClassRecordState = {
    selectedRecord: ClassRecord
    updatedData: Partial<ClassRecord>
}

// const createClassRecordSlice = () => create<ClassRecordState>((state) => ({
//     selectedRecord: {
//         classId: "",
//         classroom: "Classroom 1",
//         course: "Information Technology",
//         lecturer: "",
//         status: "Ended",

//     },
//     updatedData
// }))

type ClassSessionStore = {
    attendances: Attendance[]
    manualAttendanceForm: Attendance
}