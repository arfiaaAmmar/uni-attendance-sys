import { handleCatchError } from "@helpers/shared-helpers";
import { StudentModel } from "@models/model";
import { FM } from "@shared-library/constants";
import { Student } from "@shared-library/types";
import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';

export const registerStudent = async (req: Request, res: Response) => {
  try {
    const { email, name, phone, course } = req.body as Omit<Student, "studentId">;

    const existingUser = await StudentModel.findOne({ email });
    if (existingUser) return res.status(409).json({ message: FM.userExist });
    const uniqueId = uuidv4().substring(0, 4)
    const studentId = `DKM-${uniqueId}-${uniqueId}`;

    await StudentModel.create({
      studentId,
      email,
      name,
      phone,
      course,
    });

    res.status(201).json({ message: FM.studentRegisterSuccess });
  } catch (error) {
    handleCatchError(res, error, FM.studentRegisterFailed);
  }
};

export const searchStudent = async (req: Request, res: Response) => {
  const { query } = req.query;

  if (typeof query !== "string") {
    return res.status(400).json({ error: FM.invalidQuery });
  }

  try {
    const students = await StudentModel.find({
      name: { $regex: new RegExp(query, "i") },
    }).limit(10);

    const suggestions = students.map((student) => student.name);

    res.json(suggestions);
  } catch (error) {
    handleCatchError(res, error, FM.default);
  }
};

export const getStudent = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  try {
    const student: Student | null = await StudentModel.findOne({ studentId });

    if (!student) return res.status(404).json({ message: FM.studentNotFound });

    res.json(student);
  } catch (error) {
    handleCatchError(res, error, FM.studentRetrievalFailed);
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await StudentModel.find({}, { password: 0 }).exec();
    if (students.length === 0) return res.status(404).json({ message: FM.studentNotFound });
    res.json(students);
  } catch (error) {
    handleCatchError(res, error, FM.studentNotFound);
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  const { studentId } = req.params;
  try {
    const existingStudent = await StudentModel.findById(studentId);
    if (!existingStudent) return res.status(404).json({ message: FM.studentNotFound });

    await StudentModel.findByIdAndDelete(studentId);

    res.status(200).json({ message: FM.studentDeleteSuccess });
  } catch (error) {
    handleCatchError(res, error, FM.studentDeleteFailed);
  }
};

export const query = async (req: Request, res: Response) => {
  const { query } = req.query;
  try {
    const suggestions = await StudentModel.find({ name: { $regex: query, $options: 'i' } }).limit(10);
    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Server error' });
  }
}