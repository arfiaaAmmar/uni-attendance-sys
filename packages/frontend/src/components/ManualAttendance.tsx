import { useState, useEffect, FormEvent } from "react";
import { Button } from "@mui/material";
import { getAllStudents } from "../api/student-api";
import {
  getLocalClassSessionData,
  postAttendance,
} from "../api/class-record-api";
import { ModalActivationProps, Student } from "@shared-library/types";
import { FM } from "@shared-library/constants";
import { generateClassId } from "@helpers/shared-helpers";
import { getClassSessionData } from "@api/admin-api";

const ManualAttendance = ({ isActive, setIsActive }: ModalActivationProps) => {
  const [suggestions, setSuggestions] = useState<Student[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [manualAttendanceForm, setManualAttendanceForm] = useState({
    studentId: "",
    studentName: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const initialStudentListFetch = async () => {
      try {
        const data = await getAllStudents();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    initialStudentListFetch();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setManualAttendanceForm((prevForm) => ({ ...prevForm, [name]: value }));

    const filteredSuggestions = suggestions.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.studentId.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filteredSuggestions);
    setShowSuggestions(!!value);
  };

  const handleSuggestionClick = (suggestion: Student) => {
    setManualAttendanceForm({
      studentId: suggestion.studentId,
      studentName: suggestion.name,
    });
    setShowSuggestions(false);
  };

  const closeModal = () => setIsActive(false);

  const handleManualAttendanceSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      // Check if student already exist in current class session
      const currentAttendance = getLocalClassSessionData().attendance;
      const studentExists = currentAttendance?.some(
        (attendance) => attendance.studentId === manualAttendanceForm.studentId
      );
      if (studentExists) {
        setError("Student already exists");
        return;
      }

      // Update the class record with the manual attendance data to
      // session storage
      const classId = getClassSessionData()?.classId
      await postAttendance(classId, {
        studentName: manualAttendanceForm.studentName,
        studentId: manualAttendanceForm.studentId,
        attendanceTime: new Date().toISOString(),
      });

      setManualAttendanceForm({
        studentId: "",
        studentName: "",
      });

      // Clear all
      setIsActive(false);
      setSuggestions([]);
      setShowSuggestions(false);
    } catch (error) {
      console.error(FM.errorUpdatingClassRecord, error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md p-8">
        <p className="text-lg mb-4">Manual Attendance</p>
        <p className="text-red-600 font-bold">{error}</p>
        <form onSubmit={handleManualAttendanceSubmit}>
          <input
            type="text"
            name="studentId"
            placeholder="Enter Student ID"
            value={manualAttendanceForm.studentId}
            onChange={handleChange}
            className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
          />
          <input
            type="text"
            name="studentName"
            placeholder="Enter Student Name"
            value={manualAttendanceForm.studentName}
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
          <div className="flex justify-between mt-4">
            <Button
              type="submit"
              variant="outlined"
              className="bg-green-500 text-white"
            >
              Add Student
            </Button>
            <Button
              onClick={closeModal}
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
