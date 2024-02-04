import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from 'express'
import { ObjectId } from "mongodb";
import { Admin } from "@shared-library/types";
import { FM } from "@shared-library/constants";
import { handleCatchError } from "@helpers/shared-helpers";
import { AdminModel } from "@models/model";
import { JWT_SECRET } from "@config/config";

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingUser = await AdminModel.findOne({ email });
    if (existingUser) return res.status(409).json({ message: FM.userExist });

    const hashedPassword = await bcrypt.hash(password!, 10);
    await AdminModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    res.status(201).json({ message: FM.userRegisterSuccess });
  } catch (error) {
    handleCatchError(res, error, FM.userRegisterFailed);
  }
};

export const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await AdminModel.findOne({ email });
    if (!user) return res.status(401).json({ message: FM.userNotFound });
    const passwordMatch = await bcrypt.compare(password, user?.password!);
    if (!passwordMatch)
      return res.status(401).json({ message: FM.invalidCredentials });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET!);

    res.json({ message: FM.loginSuccess, token });
  } catch (error) {
    handleCatchError(res, error, FM.loginFailed);
  }
};

export const authoriseAdmin = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: FM.noAuthToken });

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET!);
    const userId: ObjectId = new ObjectId(decoded.userId);
    const user = (await AdminModel.findById(userId)) as Admin;
    const { email, name, phone } = user || {};
    if (!user) return res.status(404).json({ message: FM.userNotFound });

    res.json({ email, name, phone });
  } catch (error) {
    handleCatchError(res, error, FM.userNotFound);
  }
};

export const updateAdmin = async (req: Request, res: Response) => {
  const { email, ...adminData } = req.body;

  try {
    const selectedAdmin = await AdminModel.findOne({ email }).lean();
    if (!selectedAdmin)
      return res.status(404).json({ message: FM.adminNotFound });

    Object.assign(selectedAdmin, adminData);
    await AdminModel.updateOne({ _id: selectedAdmin._id }, adminData);

    return res
      .status(200)
      .json({ message: FM.adminUpdateSuccess, admin: selectedAdmin });
  } catch (error) {
    handleCatchError(res, error, FM.adminUpdateError);
  }
};

export const removeAdmin = async (req: Request, res: Response) => {
  const { adminId } = req.params;

  try {
    const existingStudent = await AdminModel.findById(adminId);
    if (!existingStudent)
      return res.status(404).json({ message: FM.studentNotFound });

    await AdminModel.findByIdAndDelete(adminId);
    res.status(200).json({ message: FM.studentDeleteSuccess });
  } catch (error) {
    handleCatchError(res, error, FM.studentDeleteFailed);
  }
};