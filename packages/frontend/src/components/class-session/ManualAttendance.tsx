import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Button } from "@mui/material";
import { Attendance, ModalActivationProps, Student } from "shared-library/dist/types";
import { FM, STORAGE_NAME } from "shared-library/dist/constants";
import { getLocalClassSessionData, updateClassRecord } from "@api/class-record-api";
import { getAllStudents } from "@api/student-api";
import { FeedbackMessage } from "@components/shared/FeedbackMessage";


const ManualAttendance = ({ isActive, setIsActive }: ModalActivationProps) => {
  const [suggestions, setSuggestions] = useState<Student[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [form, setForm] = useState<Attendance>({
    studentId: "",
    studentName: "",
    attendanceTime: new Date().toISOString()
  });
  const [success, setSuccess ] = useState('')
  const [error, setError] = useState("");

  useEffect(() => {
    const initialStudentListFetch = async () => {
      try {
        const data = await getAllStudents();
        sessionStorage.setItem(STORAGE_NAME.suggestions, JSON.stringify(data))
        const localSuggestionData = sessionStorage.getItem(STORAGE_NAME.suggestions)
        const suggestionObj = JSON.parse(localSuggestionData!)
        setSuggestions(suggestionObj);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    initialStudentListFetch();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  
    const filteredSuggestions = suggestions.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.studentId.toLowerCase().includes(value.toLowerCase())
    );
  
    setSuggestions(filteredSuggestions);
    setShowSuggestions(!!value || filteredSuggestions.length > 0);
  };

  const handleSuggestionClick = (suggestion: Student) => {
    setForm({
      studentId: suggestion.studentId,
      studentName: suggestion.name,
    });
    setShowSuggestions(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      // Check if student already exist in current class session
      const currentAttendance = getLocalClassSessionData().attendance;
      console.log('drjiodjy', currentAttendance)
      const studentExists = currentAttendance?.some(
        (attendance) => attendance.studentId === form.studentId
      );
      if (studentExists) {
        setError(FM.studentExist);
        return;
      }

      // Update the class record with the manual attendance data to session storage
      const classId = getLocalClassSessionData()?.classId
      const param: Attendance[] = [{
        studentName: form.studentName,
        studentId: form.studentId,
        attendanceTime: new Date().toISOString(),
      }]
      await updateClassRecord(classId, { attendance: param });

      setForm({
        studentId: "",
        studentName: "",
        attendanceTime: "",
      });

      setIsActive(false);
      setSuggestions([]);
      setShowSuggestions(false);
      setSuccess(FM.addingAttendanceSuccess)
      setTimeout(() => {setSuccess('')}, 2000)
    } catch (error) {
      console.error(FM.errorUpdatingClassRecord, error);
      setError(FM.addingAttendanceFailed)
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isActive ? ' ' : 'hidden'}`}>
      <div className="bg-white rounded-md p-8">
        <p className="text-lg mb-4">Manual Attendance</p>
        <p className="text-red-600 font-bold">{error}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="studentId"
            placeholder="Enter Student ID"
            value={form.studentId}
            onChange={handleChange}
            className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
          />
          <input
            type="text"
            name="studentName"
            placeholder="Enter Student Name"
            value={form.studentName}
            onChange={handleChange}
            className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
          />
          <div className="relative mt-4">
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.studentId}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                  >
                    {suggestion.name} - {suggestion.studentId}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <FeedbackMessage {...{success, error}} />
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
    </div>
  );
};

export default ManualAttendance;
