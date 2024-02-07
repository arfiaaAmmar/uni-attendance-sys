import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import SearchBox from "@components/shared/SearchBox";
import { handleUploadExcelForStudentRegistration } from "@utils/upload-excel";
import { filterSearchQuery } from "@helpers/search-functions";
import { Student } from "shared-library/src/types";
import { getAllStudents, registerStudent } from "@api/student-api";
import { FM } from "shared-library/src/constants";
import { isEmpty } from "radash";
import { RegisterNewStudentModal } from "@components/student-database/RegisterNewStudentModal";


const StudentDatabase = () => {
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [registerModal, setRegisterModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Omit<Student, "studentId">>({
    name: "",
    email: "",
    phone: "",
    course: undefined,
  });

  const fetchAllStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudentList(data);
    } catch (error) {
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isEmpty(formData)) {
      setError(FM.pleaseFillInAllUserData);
      return;
    }
    try {
      await registerStudent({
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        course: formData.course,
      });
      setSuccess("Successfully added user!");
      setFormData({
        email: "",
        name: "",
        phone: "",
        course: undefined,
      });
      setTimeout(() => {
        setSuccess("");
      }, 3000);
      // Fetch updated user list
      const updatedStudentList = await getAllStudents();
      setStudentList(updatedStudentList);
      setRegisterModal(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleUploadButton = () => {
    if (fileInputRef?.current?.files) {
      const selectedFile = fileInputRef.current.files[0];

      if (selectedFile) {
        console.log("Selected file", selectedFile);
        handleUploadExcelForStudentRegistration(selectedFile);
      } else {
        console.log("No file selected,");
      }
    }
  };

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
            onClick={handleUploadButton}
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
      </div>
      <div className="bg-neutral-200 h-[60vh] overflow-y-auto">
        {filteredStudents?.map((student, index) => (
          <li
            key={student.studentId}
            className="flex px-4 py-2 justify-between scroll-auto"
          >
            <p className="w-1/12">{index + 1}</p>{" "}
            <p className="w-5/12">{student?.name}</p>{" "}
            <p className="w-3/12">{student?.studentId}</p>{" "}
            <p className="w-3/12">{student?.course}</p>{" "}
          </li>
        ))}
      </div>

      {registerModal && (
        <RegisterNewStudentModal
          registerModal={registerModal}
          setRegisterModal={setRegisterModal}
          success={success}
          error={error}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default StudentDatabase;
