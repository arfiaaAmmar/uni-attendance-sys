import { Button } from "@mui/material";
import { Student } from "shared-library/dist/types";
import { FeedbackMessage } from "@components/shared/FeedbackMessage";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";
import { getAllStudents, registerStudent } from "@api/student-api";
import { FM, isUnfilledObject } from "shared-library";

type StudentRegisterModalProps = {
  studentList: Student[]
  registerModal: boolean;
  setStudentList: Dispatch<SetStateAction<Student[]>>
  setRegisterModal: Dispatch<SetStateAction<boolean>>
};

export function RegisterNewStudentModal({
  registerModal,
  setStudentList,
  studentList,
  setRegisterModal,
}: StudentRegisterModalProps) {
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<Omit<Student, "studentId">>({
    name: "",
    email: "",
    phone: "",
    course: undefined,
  });

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isUnfilledObject(formData)) {
      setError(FM.pleaseFillInAllUserData)
      setTimeout(() => { setError("") }, 2000)
      return
    }
    try {
      await registerStudent(formData);
      setStudentList(await getAllStudents())
      setSuccess(FM.studentRegisterSuccess);
      setTimeout(() => { setSuccess("") }, 3000);
      setFormData({
        email: "",
        name: "",
        phone: "",
        course: undefined,
      });

      await getAllStudents();
      setRegisterModal(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md p-8">
        <p className="text-lg mb-4">Register Student</p>
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
            value={formData.course}
            onChange={handleChange}
            className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
          >
            <option value="" disabled selected>
              Select a course
            </option>
            <option value="Information Technology">
              Information Technology
            </option>
            <option value="Security">Security</option>
            <option value="Secretary">Secretary</option>
            <option value="Food & Beverage">Food & Beverage</option>
          </select>
          <FeedbackMessage {...{ success, error }} />
          <div className="flex justify-between mt-4">
            <Button
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
