import { Button } from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import SearchBox from "../components/SearchBox";
import { handleUploadExcelForStudentRegistration } from "../utils/upload-excel";
import { filterSearchQuery } from "../helpers/search-functions";
import { Student } from "shared-library/src/types";
import { getAllStudents, registerStudent } from "../api/student-api";
import { defFeedback } from "shared-library/src/constants";

const StudentDatabase = () => {
  const [studentList, setStudentList] = useState<Student[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const [registerModal, setRegisterModal] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [feedback, setFeedback] = useState(defFeedback);
  const [formData, setFormData] = useState<Omit<Student, "studentId">>({
    name: "",
    email: "",
    phone: "",
    course: undefined,
  });

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const data = await getAllStudents();
        setStudentList(data);
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };
    const filteredList = filterSearchQuery<Student>(searchQuery, studentList!, [
      "name",
      "studentId",
      "course",
      "email",
      "phone",
    ]);
    setFilteredStudents(filteredList);

    fetchAllStudents();
  }, [studentList, searchQuery]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (
      formData.email === "" ||
      formData.name === "" ||
      formData.phone === "" ||
      formData.course === null
    ) {
      setFeedback({ ...feedback, error: "Please fill in all user data" });
      return;
    }
    try {
      await registerStudent({
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        course: formData.course,
      });
      setFeedback({ ...feedback, success: "Successfully added user!" });
      setFormData({
        email: "",
        name: "",
        phone: "",
        course: undefined,
      });
      setTimeout(() => {
        setFeedback({ ...feedback, success: "" });
      }, 3000);
      // Fetch updated user list
      const updatedStudentList = await getAllStudents();
      setStudentList(updatedStudentList);
      setRegisterModal(!registerModal);
    } catch (error: any) {
      setFeedback({ ...feedback, error: error.message });
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
        <SearchBox query={searchQuery} onChange={setSearchQuery} />
        <input
          type="file"
          accept=".xlsx"
          placeholder="Upload Excel File"
          className="bg-green-300 px-2 py-1 font-semibold"
          ref={fileInputRef}
        />
        <button
          className="bg-green-600 px-2 py-1 font-semibold ml-2"
          onClick={handleUploadButton}
        >
          Upload Excel
        </button>
        <button
          className="bg-green-600 px-2 py-1 font-semibold"
          onClick={() => setRegisterModal(true)}
        >
          Register New Student
        </button>
      </div>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md p-8">
            <p className="text-lg mb-4">Register Student</p>
            {feedback.error ? (
              <p className="text-red-500 font-bold">{feedback.error}</p>
            ) : feedback.success ? (
              <p className="text-green-600 font-bold">{feedback.success}</p>
            ) : null}

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
              />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
              />
              <select
                name="course"
                id="course"
                className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
                value={formData.course?.toString()}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select a course
                </option>
                <option value="Information Technology">
                  Information Technology
                </option>
                <option value="Security">Security</option>
                <option value="Secretary">Secretary</option>
                <option value="Food & Beverage">Food & Beverage</option>
              </select>
              <div className="flex justify-between mt-4">
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  className="bg-green-600 text-white font-bold"
                  type="submit"
                >
                  Submit
                </Button>
                <Button
                  onClick={() => setRegisterModal(!registerModal)}
                  variant="outlined"
                  className="text-gray-600"
                >
                  Close
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDatabase;
