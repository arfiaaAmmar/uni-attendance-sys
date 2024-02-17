import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Button } from "@mui/material";
import {
  STUDENT_COURSES,
  CLASSROOM_LIST, PAGES_PATH
} from "shared-library/dist/constants";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { ClassDetails, FeedbackProps, ModalActivationProps } from "shared-library/dist/types";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

type HandleChangeType = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

interface InitialClassSessionFormProps extends ModalActivationProps {
  form: ClassDetails;
  setForm: Dispatch<SetStateAction<ClassDetails>>
  submitForm: (event: FormEvent) => void
  selectedDate: Dayjs
  setSelectedDate: Dispatch<SetStateAction<Dayjs>>
  startTime: Dayjs
  setStartTime: Dispatch<SetStateAction<Dayjs>>
  endTime: Dayjs
  setEndTime: Dispatch<SetStateAction<Dayjs>>
  feedback: FeedbackProps
  setFeedback: Dispatch<SetStateAction<FeedbackProps>>
}

function InitialClassSessionForm(props: InitialClassSessionFormProps) {
  const navigate = useNavigate();

  const handleChange = (e: HandleChangeType) => {
    const { name, value } = e.target;
    props?.setForm((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${props?.isActive ? '' : 'hidden'}`}>
      <div className="bg-white rounded-md p-8 w-1/3">
        <p className="text-lg mb-4">Create New Class Session</p>
        <form onSubmit={props?.submitForm}>
          <input
            type="text"
            name="lecturer"
            placeholder="Lecturer Name"
            value={props?.form.lecturer}
            className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
          />
          <select
            name="course"
            id="course"
            className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
            value={props?.form.course}
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
            value={props?.form.classroom}
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
                value={props?.selectedDate}
                onChange={(e: any) => props?.setSelectedDate(e.target.value)}
              />
              <TimePicker
                label="Start Time"
                value={props?.startTime}
                onChange={(value: Dayjs | null, ctx: any) => { if (value) props?.setStartTime(value) }}
              />
              <TimePicker
                label="End Time"
                value={props?.endTime}
                onChange={(value: Dayjs | null, context: any) => { if (value) props?.setEndTime(value) }}
              />
            </div>
          </LocalizationProvider>
          {props?.feedback?.success && <p className="text-green-500 font-bold">{props?.feedback?.success}</p>}
          {props?.feedback?.error && <p className="text-red-500 font-bold">{props?.feedback?.error}</p>}
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
