import { getAdminData } from "@api/admin-api"
import { getAllClassRecords, getClassRecord } from "@api/class-record-api"
import { getAllStudents, getStudent } from "@api/student-api"
import { useDataFetching } from "@helpers/shared-helpers"
import { Admin, ClassRecord, Student } from "@shared-library/types"


export const useUserProfile = () => {
    return useDataFetching<Admin>(async () => await getAdminData())
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

