import { Request, Response } from "express";
import { ClassRecordModel } from "../model/model";
import { FM } from "shared-library/src/constants";
import { ClassRecord, IClassRecordModel } from "shared-library/src/types";
import { handleCatchError } from "../helpers/shared-helpers";

export const postClassRecord = async (req: Request, res: Response) => {
  try {
    const input: ClassRecord = req.body;
    const newClassRecord = await ClassRecordModel.create({ ...input });
    res.status(201).json(newClassRecord);
  } catch (error) {
    handleCatchError(res, error, FM.classRecordCreationFailed);
  }
};

export const postAttendance = async (req: Request, res: Response) => {
  const { classId } = req.params;
  const attendanceBody: Pick<ClassRecord, "attendance"> = req.body;

  try {
    const classRecord = await ClassRecordModel.findById(classId);
    if (!classRecord)
      return res.status(404).json({ message: FM.classRecordNotFound });

    classRecord?.attendance?.push(...attendanceBody?.attendance!);
    const updatedClassRecord = await classRecord.save();

    res.status(201).json(updatedClassRecord);
  } catch (error) {
    handleCatchError(res, error, FM.addingAttendanceFailed);
  }
};

export const getClassRecord = async (req: Request, res: Response) => {
  const { _id } = req.params;

  try {
    const classRecord = await ClassRecordModel.findById(_id);
    if (!classRecord)
      return res.status(404).json({ message: FM.classRecordNotFound });
    res.json(classRecord);
  } catch (error) {
    handleCatchError(res, error, FM.classRecordCreationFailed);
  }
};

export const getAllClassRecords = async (req: Request, res: Response) => {
  try {
    // Retrieve class record by ID
    const classRecord = await ClassRecordModel.find({}, { password: 0 }).exec();
    if (!classRecord)
      return res.status(404).json({ message: FM.classRecordNotFound });
    res.json(classRecord);
  } catch (error) {
    handleCatchError(res, error, FM.classRecordRetrievalFailed);
  }
};

export const getLiveClassSessions = async (req: Request, res: Response) => {
  try {
    const currentDate = new Date(); // Get the current date and time

    // Find all class records where the date is today and the endTime is in the future
    const liveClassRecords = await ClassRecordModel.find({
      date: { $eq: currentDate.toISOString().split("T")[0] }, // Compare only the date part
      endTime: { $gt: currentDate.toISOString().split("T")[1] }, // Compare only the time part
    }).exec();
    if (liveClassRecords.length === 0)
      return res.status(404).json({ message: FM.liveClassSessionNotFound });

    res.json(liveClassRecords);
  } catch (error) {
    handleCatchError(res, error, FM.liveClassSessionNotFound);
  }
};

export const updateClassRecord = async (req: Request, res: Response) => {
  const { classId } = req.params;
  const updatedData: IClassRecordModel = req.body;

  try {
    let classRecord = (await ClassRecordModel.findById(
      classId
    )) as IClassRecordModel;
    if (!classRecord)
      return res.status(404).json({ message: FM.classRecordNotFound });

    classRecord = updatedData;

    await classRecord.save();
    res.json(classRecord);
  } catch (error) {
    handleCatchError(res, error, FM.errorUpdatingClassRecord);
  }
};

export const deleteClassRecord = async (req: Request, res: Response) => {
  const { classId } = req.params;

  try {
    const deletedRecord = await ClassRecordModel.findByIdAndDelete(classId);
    if (!deletedRecord)
      return res.status(404).json({ message: FM.classRecordNotFound });
    res.json({ message: FM.classRecordDeleteSuccess });
  } catch (error) {
    handleCatchError(res, error, FM.classRecordDeleteFailed);
  }
};

export const deleteAttendanceRecord = async (req: Request, res: Response) => {
  const { classId } = req.params;

  try {
    const deletedRecord = await ClassRecordModel.findByIdAndDelete(classId);
    if (!deletedRecord)
      return res.status(404).json({ message: FM.classRecordNotFound });
    res.json({ message: FM.classRecordDeleteSuccess });
  } catch (error) {
    handleCatchError(res, error, FM.classRecordDeleteFailed);
  }
};
