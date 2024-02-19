import { useState, useEffect, ChangeEvent, FormEvent, Dispatch } from "react";
import { Button } from "@mui/material";
import { Attendance, ModalActivationProps, Student } from "shared-library/dist/types";
import { FM, STORAGE_NAME } from "shared-library/dist/constants";
import { saveSuggestionsToLocal } from "@api/class-record-api";
import { getAllStudents } from "@api/student-api";
import { FeedbackMessage } from "@components/shared/FeedbackMessage";
import { defStudentState } from "@utils/constants";
import { StudentInfo } from "@components/shared/StudentInfo";
import { SetStateAction } from "jotai";

interface ManualAttendanceProps extends ModalActivationProps {
  form: Attendance
  handleSubmit: (event: FormEvent) => Promise<void>
  setForm: Dispatch<SetStateAction<Attendance>>
}

const ManualAttendance = ({ isActive, setIsActive, handleSubmit, form, setForm }: ManualAttendanceProps) => {
  const [suggestions, setSuggestions] = useState<Student[]>([]);
  const [student, setStudent] = useState<Student>(defStudentState)
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [success, setSuccess] = useState('')
  const [error, setError] = useState("");

  useEffect(() => {
    const initialStudentListFetch = async () => {
      try {
        const data = await getAllStudents();
        saveSuggestionsToLocal(data)
        setSuccess(FM.successFetchingData)
        setTimeout(() => setSuccess(''), 2000)
      } catch (error) {
        setError(FM.errorFetchingData)
        setTimeout(() => setError(''), 2000)
        console.error(FM.errorFetchingData, error);
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
    setStudent(suggestion)
    setShowSuggestions(false);
  }

  const styles = {
    formTitle: "text-lg mb-4",
    formBackground: "bg-white rounded-md p-8 flex gap-5",
    formInput: "border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600",
    suggestionsBg: "absolute z-10 bg-white border border-gray-300 rounded w-full"
  }

  if (!isActive) return null
  return (
    <div className="fixed z-30 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className={styles.formBackground}>
        <div className="w-1/2">
          <p className={styles.formTitle}>Manual Attendance</p>
          <p className="text-red-600 font-bold">{error}</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="studentId"
              placeholder="Enter Student ID"
              value={form?.studentId}
              onChange={handleChange}
              className={styles.formInput}
            />
            <input
              type="text"
              name="studentName"
              placeholder="Enter Student Name"
              value={form?.studentName}
              onChange={handleChange}
              className={styles.formInput}
            />
            <div className="relative mt-4">
              {showSuggestions && suggestions.length > 0 && (
                <ul className={styles.suggestionsBg}>
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
        <StudentInfo student={student} />
      </div>
    </div>
  );
};

export default ManualAttendance;
