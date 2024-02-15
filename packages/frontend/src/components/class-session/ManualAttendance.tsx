import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Avatar, Button } from "@mui/material";
import { Attendance, ModalActivationProps, Student } from "shared-library/dist/types";
import { FM, STORAGE_NAME } from "shared-library/dist/constants";
import { getClassRecord, getLocalClassSessionData, updateClassRecord } from "@api/class-record-api";
import { getAllStudents } from "@api/student-api";
import { FeedbackMessage } from "@components/shared/FeedbackMessage";

interface ManualAttendanceProps extends ModalActivationProps {
  classId?: string
  onSubmit?: () => void
}

const ManualAttendance = ({ isActive, setIsActive, classId }: ManualAttendanceProps) => {
  const [suggestions, setSuggestions] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student>()
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [form, setForm] = useState<Attendance>({
    studentId: "",
    studentName: "",
    attendanceTime: new Date().toISOString()
  });
  const [success, setSuccess] = useState('')
  const [error, setError] = useState("");

  useEffect(() => {
    const initialStudentListFetch = async () => {
      try {
        const data = await getAllStudents();
        sessionStorage.setItem(STORAGE_NAME.suggestions, JSON.stringify(data))
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    initialStudentListFetch();
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));

    const storedSuggestions = sessionStorage.getItem(STORAGE_NAME.suggestions);
    if (storedSuggestions) {
      const suggestionsFromStorage: Student[] = JSON.parse(storedSuggestions);
      const filteredSuggestions = suggestionsFromStorage.filter(
        (item) =>
          item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.studentId.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(!!value || filteredSuggestions.length > 0);
    }
  };
  function handleSuggestionClick(suggestion: Student) {
    setForm({
      studentId: suggestion.studentId,
      studentName: suggestion.name,
    });
    setSelectedStudent(suggestion)
    setShowSuggestions(false);
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      const currentAttendance = getLocalClassSessionData()?.attendance;
      const studentExists = currentAttendance?.some(
        (attendance) => attendance?.studentId === form?.studentId
      );
      if (studentExists) {
        setError(FM.studentExist);
        return;
      }

      const _classId = classId || getLocalClassSessionData()?.classId
      const param: Attendance[] = [{
        studentName: form?.studentName,
        studentId: form?.studentId,
        attendanceTime: new Date().toISOString(),
      }]
      await updateClassRecord(_classId, { attendance: param });
      setForm({
        studentId: "",
        studentName: "",
        attendanceTime: "",
      });

      setIsActive(false);
      setSuggestions([]);
      setShowSuggestions(false);
      setSuccess(FM.addingAttendanceSuccess)
      setTimeout(() => { setSuccess('') }, 2000)
    } catch (error) {
      console.error(FM.errorUpdatingClassRecord, error);
      setError(FM.addingAttendanceFailed)
    }
  };

  if (!isActive) return null
  return (
    <div className={`fixed z-30 inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
      <div className="bg-white rounded-md p-8 flex gap-5">
        <div className="w-1/2">
          <p className="text-lg mb-4">Manual Attendance</p>
          <p className="text-red-600 font-bold">{error}</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="studentId"
              placeholder="Enter Student ID"
              value={form?.studentId}
              onChange={handleChange}
              className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
            />
            <input
              type="text"
              name="studentName"
              placeholder="Enter Student Name"
              value={form?.studentName}
              onChange={handleChange}
              className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
            />
            <div className="relative mt-4">
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.studentId}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="cursor-pointer p-2 hover:bg-gray-100"
                    >
                      {suggestion.name} - {suggestion.studentId}
                    </button>
                  ))}
                </ul>
              )}
            </div>
            <FeedbackMessage {...{ success, error }} />
            <div className="flex justify-between mt-4">
              <Button
                type="submit"
                variant="outlined"
                className="bg-green-500 text-white"
              >
                Add Student
              </Button>
              <Button
                onClick={() => setIsActive(false)}
                variant="outlined"
                className="text-gray-600"
              >
                Close
              </Button>
            </div>
          </form>
        </div>
        <div className="border-l-2 pl-4">
          <Avatar
            style={{ width: "100px", height: "100px" }}
            className="mx-auto mb-4"
          />
          <p className="text-neutral-500">Student Name</p>
          <p className="text-xl">{selectedStudent?.name}</p>
          <p className="text-neutral-500">Student Id</p>
          <p className="text-xl">{selectedStudent?.studentId}</p>
          <p className="text-neutral-500">Course</p>
          <p className="text-xl">{selectedStudent?.course}</p>
        </div>
      </div>
    </div>
  );
};

export default ManualAttendance;
