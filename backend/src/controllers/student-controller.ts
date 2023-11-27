// studentController.ts
import { Request, Response } from "express";
import { StudentModel } from "../model/model";
import { Student } from "../../../shared-library/src/types";
import { FM } from "shared-library/src/constants";

export const registerStudent = async (req: Request, res: Response) => {
  try {
    const { email, name, phone, course } = req.body;

    // Check if user already exists
    const existingUser = await StudentModel.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: FM.userExist });

    // Create random matrik number based on current time
    const randomNumber = Math.floor(Math.random() * 10000);
    const formattedRandomNumber = randomNumber.toString().padStart(4, "0");

    const studentIdGeneration = `DKM-${formattedRandomNumber}-${formattedRandomNumber}`;

    // Create new user
    await StudentModel.create({
      studentId: studentIdGeneration,
      email,
      name,
      phone,
      course,
    });

    res.status(201).json({ message: FM.studentRegisterSuccess });
  } catch (error) {
    console.error(FM.studentRegisterFailed, error);
    res.status(500).json({ message: FM.serverError });
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
    console.error(error);
    res.status(500).json({ error: FM.default });
  }
};



export const getStudent = async (req: Request, res:Response) => {
  const { studentId } = req.params

  try {
    const student: Student | null = await StudentModel.findOne({ studentId })

    if(!student) return res.status(404).json({ message:FM.studentNotFound})

    res.json(student)
  } catch (error ){
    console.error(FM.studentRetrievalFailed, error);
    res.status(500).json({ message: FM.serverError });
  }
}

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await StudentModel.find({}, { password: 0 }).exec();

    if (students.length === 0) {
      return res.status(404).json({ message: FM.studentNotFound });
    }

    res.json(students);
  } catch (error) {
    return res.status(401).json({ message: FM.studentNotFound });
  }
};

export const removeStudent = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  try {
    // Check if student exists
    const existingStudent = await StudentModel.findById(studentId);
    if (!existingStudent) {
      return res.status(404).json({ message: FM.studentNotFound });
    }

    // Remove the student
    await StudentModel.findByIdAndDelete(studentId);

    res.status(200).json({ message: FM.studentDeleteSuccess });
  } catch (error) {
    console.error(FM.studentDeleteFailed, error);
    res.status(500).json({ message: FM.serverError });
  }
};
