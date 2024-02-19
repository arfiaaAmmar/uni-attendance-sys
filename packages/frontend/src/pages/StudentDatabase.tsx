import { useEffect, useRef, useState } from "react";
import SearchBox from "@components/shared/SearchBox";
import { filterSearchQuery } from "@helpers/search-functions";
import { Student } from "shared-library/dist/types";
import { getAllStudents, registerStudent } from "@api/student-api";
import { RegisterNewStudentModal } from "@components/student-database/RegisterNewStudentModal";
import { handleDelete } from "@api/class-record-api";
import { FM } from "shared-library";
import { parseStudentRegisterFile } from "@utils/upload-excel";

const StudentDatabase = () => {
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [registerModal, setRegisterModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchAllStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudentList(data);
    } catch (error) {
      setError(FM.errorFetchingData)
      console.error("Error fetching user list:", error);
    }
  };

  useEffect(() => {
    fetchAllStudents()
  }, [])

  useEffect(() => {
    const filteredList = filterSearchQuery<Student>(searchQuery, studentList, [
      "name",
      "studentId",
      "course",
      "email",
      "phone",
    ]);
    setFilteredStudents(filteredList);

    return () => setFilteredStudents([])
  }, [studentList, searchQuery]);

  async function handleUploadBtn() {
    if (!(fileInputRef?.current?.files)) return
    const selectedFile = fileInputRef.current.files[0];

    try {
      if (selectedFile) {
        const excelData = await parseStudentRegisterFile(selectedFile)
        excelData?.forEach(row => {
          registerStudent(row)
        })
        await fetchAllStudents()
        setSuccess("Uploading excel success")
        setTimeout(() => setSuccess(""), 2000)
      } else {
        setError("Error uploading excel")
        setTimeout(() => setError(""), 2000)
      }
    } catch (error) {
      console.error(error)
    }

  };

  async function handleStudentDelete(_id: string | undefined) {
    try {
      await handleDelete(_id, "student")
      await fetchAllStudents()
      setSuccess(FM.studentDeleteSuccess)
      setTimeout(() => setSuccess(''), 2000)
    } catch (error) {
      setError(FM.studentDeleteFailed)
      setTimeout(() => setError(''), 2000)
    }
  }

  return (
    <div className="p-8 h-full">
      <p className="text-3xl mb-4 font-bold">Student Database</p>
      <div className="flex justify-between mt-8">
        <div className="border-neutral-400 border-2 rounded-md p-2 my-auto">
          <SearchBox query={searchQuery} onChange={setSearchQuery} />
        </div>
        <div className="bg-slate-500 rounded-md m-2">
          <input
            type="file"
            accept=".xlsx"
            placeholder="Upload Excel File"
            className="bg-slate-300 rounded-l-md px-2 py-1 font-semibold"
            ref={fileInputRef}
          />
          <button
            className="text-white px-2 font-semibold hover:cursor-pointer"
            onClick={handleUploadBtn}
          >
            Upload Excel
          </button>
        </div>
        <button
          className="bg-green-600 rounded-md px-2 py-1 font-semibold hover:cursor-pointer"
          onClick={() => setRegisterModal(true)}
        >
          Register New Student
        </button>
      </div>
      {success && <p className="text-green-500 font-bold">{success}</p>}
      {error && <p className="text-red-500 font-bold">{error}</p>}
      <div className="bg-neutral-400 flex px-4 py-2 justify-between h-14 mt-4">
        <p className="font-semibold w-1/12">No.</p>
        <p className="font-semibold w-5/12">Full Name</p>
        <p className="font-semibold w-3/12">Student ID</p>
        <p className="font-semibold w-3/12">Course</p>
        <p className="font-semibold w-1/12">Delete</p>
      </div>
      <div className="bg-neutral-200 h-[60vh] overflow-y-auto">
        {filteredStudents?.map((student, index) => (
          <li key={student?._id} className="flex px-4 py-2 justify-between scroll-auto" >
            <p className="w-1/12">{index + 1}</p>{" "}
            <p className="w-5/12">{student?.name}</p>{" "}
            <p className="w-3/12">{student?.studentId}</p>{" "}
            <p className="w-3/12">{student?.course}</p>{" "}
            <p className="w-1/12 text-red-500 hover:cursor-pointer" onClick={() => handleStudentDelete(student?._id)}>Delete</p>
          </li>
        ))}
        {/* <ConfirmationDialog // TODO Will implement this
          isOpen={confirmationOpen}
          onClose={handleCloseConfirmation}
          onConfirm={handleConfirmDelete}
        /> */}
      </div>

      {registerModal && (
        <RegisterNewStudentModal {...{ registerModal, setRegisterModal }} studentList={studentList} setStudentList={setStudentList} />
      )}
    </div>
  );
};

export default StudentDatabase;
