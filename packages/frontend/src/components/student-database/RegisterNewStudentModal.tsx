import { Button } from "@mui/material";
import { Feedback, Student } from "@shared-library/types";
import { FeedbackMessage } from "@components/shared/FeedbackMessage";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";

type RegisternewStudentModalProps = {
  success: string;
  error: string;
  formData: Omit<Student, "studentId">;
  registerModal: boolean;
  setFormData: Dispatch<SetStateAction<Omit<Student, "studentId">>>
  handleSubmit: (event: FormEvent) => Promise<void>
  setRegisterModal: Dispatch<React.SetStateAction<boolean>>
};

export function RegisterNewStudentModal({
  success,
  error,
  formData,
  registerModal,
  setFormData,
  handleSubmit,
  setRegisterModal,
}: RegisternewStudentModalProps) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md p-8">
        <p className="text-lg mb-4">Register Student</p>
        <FeedbackMessage success={success} error={error} />
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
  );
}
