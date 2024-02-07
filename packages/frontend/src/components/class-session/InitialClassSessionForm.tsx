import { getUserSessionData } from "@api/admin-api";
import { postClassRecord } from "@api/class-record-api";
import { Button } from "@mui/material";
import {
  STUDENT_COURSES,
  CLASSROOM_LIST,
  FM,
  PAGES_PATH,
  STORAGE_NAME,
} from "shared-library/src/constants";
import { ClassRecord, ModalActivationProps } from "shared-library/src/types";
import { isEmpty } from "radash";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { defClassSession } from "@utils/constants";

type HandleChangeType = ChangeEvent<HTMLInputElement | HTMLSelectElement>;

const InitialClassSessionForm = ({ isActive, setIsActive }: ModalActivationProps) => {
  const [form, setForm] = useState<ClassRecord>(defClassSession);
  const [duration, setDuration] = useState(1);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: HandleChangeType) => {
    const { name, value } = e.target;

    if (name === "startTime") {
      const startTime = new Date(value);
      const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

      setForm((prevData) => ({
        ...prevData,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      }));
    } else {
      setForm((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleDurationChange = (selectedDuration: number) => {
    setDuration(selectedDuration);
  };

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    if (isEmpty(form)) {
      setError("Please fill in all class info");
      return;
    }
    try {
      const userSessionData = getUserSessionData();
      await postClassRecord({
        ...form,
        lecturer: userSessionData.name,
        attendance: form.attendance,
      });
      sessionStorage.setItem(
        STORAGE_NAME.classSessionData,
        JSON.stringify(form)
      );
      setSuccess(FM.classStartSuccess);
      setTimeout(() => {
        setSuccess("");
      }, 3000);

      // Close modal
      setIsActive(false);
    } catch (error: any) {
      console.error("Error registering new user:", error);
      setError(error);
    }
  };

  const returnToHome = () => {
    navigate(PAGES_PATH.studentDB);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isActive ? '' : 'hidden'}`}>
      <div className="bg-white rounded-md p-8 w-1/3">
        <p className="text-lg mb-4">Create New Class Session</p>
        <form onSubmit={submitForm}>
          <input
            type="text"
            name="lecturer"
            placeholder="Lecturer Name"
            value={form.lecturer}
            className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
          />
          <select
            name="course"
            id="course"
            className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
            value={form.course}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select a course
            </option>
            {Object.values(STUDENT_COURSES).map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))}
          </select>
          <select
            name="classroom"
            id="classroom"
            className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
            value={form.classroom}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select classroom
            </option>
            {CLASSROOM_LIST.map((classroom, index) => (
              <option key={index} value={classroom}>
                {classroom}
              </option>
            ))}
          </select>
          <div className="mt-4">
            <p>Select Class Duration:</p>
            <div>
              {[1, 2, 3].map((hours) => (
                <label key={hours} className="mr-4">
                  <input
                    type="radio"
                    name="duration"
                    value={hours}
                    checked={duration === hours}
                    onChange={() => handleDurationChange(hours)}
                  />
                  {`${hours} hour${hours !== 1 ? "s" : ""}`}
                </label>
              ))}
            </div>
          </div>
          {success && <p className="text-green-500 font-bold">{success}</p>}
          {error && <p className="text-red-500 font-bold">{error}</p>}
          <div className="flex justify-between mt-4">
            <Button
              onSubmit={submitForm}
              variant="contained"
              className="bg-green-600 text-white font-bold"
              type="submit"
            >
              Submit
            </Button>
            <Button
              onClick={returnToHome}
              variant="outlined"
              className="text-gray-600"
            >
              Return to Home
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InitialClassSessionForm;
