import { getUserSessionData } from "@api/admin-api";
import { getLocalClassSessionData, postClassRecord, setLocalClassSessionData } from "@api/class-record-api";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Button } from "@mui/material";
import {
  STUDENT_COURSES,
  CLASSROOM_LIST,
  FM,
  PAGES_PATH
} from "shared-library/dist/constants";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { ClassRecord, ModalActivationProps } from "shared-library/dist/types";
import { isEmpty } from "radash";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { defaultClassSession } from "@utils/constants";
import { generateClassId } from "shared-library";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

type HandleChangeType = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

function InitialClassSessionForm({ isActive, setIsActive }: ModalActivationProps) {
  const [form, setForm] = useState<ClassRecord>(defaultClassSession);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs('2022-04-17T15:30'));
  const [startTime, setStartTime] = useState<Dayjs>(dayjs('2022-04-17T15:30'));
  const [endTime, setEndTime] = useState<Dayjs>(dayjs('2022-04-17T15:30'));
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: HandleChangeType) => {
    const { name, value } = e.target;
    setForm((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    if (isEmpty(form)) {
      setError("Please fill in all class info");
      return;
    }
    try {
      const userSessionData = getUserSessionData();
      const params: ClassRecord = {
        classId: generateClassId(),
        lecturer: userSessionData?.name,
        date: selectedDate?.toISOString(),
        classroom: form.classroom,
        course: form.course,
        status: form.status,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        attendance: form.attendance
      }
      console.log('params', params)
      await postClassRecord(params);
      setLocalClassSessionData(params)
      console.log('localSessionData', getLocalClassSessionData())
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
            {Object.values(STUDENT_COURSES).map((course) => (
              <option key={course} value={course}>
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
            {CLASSROOM_LIST.map((classroom) => (
              <option key={classroom} value={classroom}>
                {classroom}
              </option>
            ))}
          </select>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(e:any) => setSelectedDate(e.target.value)}
              />
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={(e:any) => setStartTime(e.target.value)}
              />
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={(e:any) => setEndTime(e.target.value)}
              />
            </div>
          </LocalizationProvider>
          {success && <p className="text-green-500 font-bold">{success}</p>}
          {error && <p className="text-red-500 font-bold">{error}</p>}
          <div className="flex justify-between mt-4">
            <Button
              variant="contained"
              className="bg-green-600 text-white font-bold"
              type="submit"
            >
              Submit
            </Button>
            <Button
              onClick={() => navigate(PAGES_PATH.studentDB)}
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
