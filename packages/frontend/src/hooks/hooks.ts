import { getAuthorisedUser } from "@api/admin-api"
import { getAllClassRecords, getClassRecord, getLiveClassRecords } from "@api/class-record-api"
import { getAllStudents, getStudent } from "@api/student-api"
import { useDataFetching } from "@helpers/shared-helpers"
import { Admin, ClassRecord, Student } from "packages/shared-library/src/types"


export const useUserProfile = () => {
    return useDataFetching<Admin>(async () => await getAuthorisedUser())
}

export const useClassRecord = (_id: string) => {
    return useDataFetching<ClassRecord>(async () => await getClassRecord(_id))
}

export const useAllClassRecord = () => {
    return useDataFetching<ClassRecord[]>(async () => await getAllClassRecords())
}

export const useStudentRecord = (_id: string) => {
    return useDataFetching<Student>(async () => await getStudent(_id))
}

export const useAllStudentRecord = () => {
    return useDataFetching<Student[]>(async () => await getAllStudents())
}

export const useLiveClassSessions = () => {
    return useDataFetching<ClassRecord[]>(async () => await getLiveClassRecords())
}


