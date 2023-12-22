import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button } from "@mui/material";
import { getAllStudents } from "../api/student-api";
import { postAttendance } from "../api/class-record-api";
import { Student } from "shared-library/src/types";

type ManualAttendanceProps = {
  classId: string;
  manualAttendanceModal: boolean;
  setManualAttendanceModal: Dispatch<SetStateAction<boolean>>;
};

const ManualAttendance = ({
  classId,
  manualAttendanceModal,
  setManualAttendanceModal,
}: ManualAttendanceProps) => {
  const [suggestions, setSuggestions] = useState<Student[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [manualAttendanceForm, setManualAttendanceForm] = useState({
    studentId: "",
    studentName: "",
  });
  const [error, setError] = useState();

  useEffect(() => {
    async () => {
      try {
        const data = await getAllStudents();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
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

  const handleManualAttendanceSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Update the class record with the manual attendance data
      await postAttendance(classId, {
        studentName: manualAttendanceForm.studentName,
        studentId: manualAttendanceForm.studentId,
        attendanceTime: new Date().toISOString(),
      });

      // Reset the form after successful submission
      setManualAttendanceForm({
        studentId: "",
        studentName: "",
      });

      // Close the modal
      setManualAttendanceModal(false);

      // Clear suggestions and hide the suggestion list
      setSuggestions([]);
      setShowSuggestions(false);
    } catch (error) {
      console.error("Error updating class record:", error);
      // Handle error states, show error message, etc.
    }
  };

  return (
    <>
      {
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md p-8">
            <p className="text-lg mb-4">Manual Attendance</p>
            <p className="text-red-600 font-bold">{error}</p>
            <form onSubmit={handleManualAttendanceSubmit}>
              <input
                type="Student ID"
                name="Student ID"
                placeholder="Enter Student ID"
                value={manualAttendanceForm.studentId}
                onChange={handleChange}
                className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
              />
              <input
                type="Student Name"
                name="Student Name"
                placeholder="Enter Student Name"
                value={manualAttendanceForm.studentName}
                onChange={handleChange}
                className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
              />
              <div className="flex justify-between mt-4">
                {showSuggestions && (
                  <ul>
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion.studentId}
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.name} - {suggestion.studentId}
                      </li>
                    ))}
                  </ul>
                )}
                {/* Buttons and other form components */}
                <Button
                  onClick={() =>
                    setManualAttendanceModal(!manualAttendanceModal)
                  }
                  variant="outlined"
                  className="text-gray-600"
                >
                  Close
                </Button>
              </div>
            </form>
          </div>
        </div>
      }
    </>
  );
};

export default ManualAttendance;
