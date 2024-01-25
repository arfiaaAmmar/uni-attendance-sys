// ClassRecordController.ts
import { handleCatchError } from "@helpers/shared-helpers";
import { ClassRecordModel } from "@models/model";
import { FM } from "@shared-library/constants";
import { ClassRecord, IClassRecordModel } from "@shared-library/types";
import { Request, Response } from "express";

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

export const getAllClassRecord = async (req: Request, res: Response) => {
  try {
    const classRecord = await ClassRecordModel.find({}, { password: 0 }).exec();
    if (!classRecord)
      return res.status(404).json({ message: FM.classRecordNotFound });
    res.json(classRecord);
  } catch (error) {
    handleCatchError(res, error, FM.classRecordRetrievalFailed);
  }
};

export const getLiveSessions = async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();
    const liveClassRecords = await ClassRecordModel.find({
      date: { $eq: currentDate.toISOString().split("T")[0] },
      endTime: { $gt: currentDate.toISOString().split("T")[1] },
    }).exec();
    if (liveClassRecords.length === 0)
      return res.status(404).json({ message: FM.liveClassSessionNotFound });
    res.json(liveClassRecords);
  } catch (error) {
    handleCatchError(res, error, FM.liveClassSessionNotFound);
  }
};

export const getRecentlyEndedSessions = async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();

    // Get the timestamp of 8 hours ago
    const eightHoursAgo = new Date(currentDate.getTime() - 8 * 60 * 60 * 1000);

    const recentlyEndedClassRecords = await ClassRecordModel.find({
      date: { $eq: currentDate.toISOString().split("T")[0] },
      endTime: { $gte: eightHoursAgo.toISOString().split("T")[1], $lt: currentDate.toISOString().split("T")[1] },
    }).exec();

    if (recentlyEndedClassRecords.length === 0) {
      return res.status(404).json({ message: FM.recentlyEndedClassSessionsNotFound });
    }

    res.json(recentlyEndedClassRecords);
  } catch (error) {
    handleCatchError(res, error, FM.recentlyEndedClassSessionsNotFound);
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

export const removeClassRecord = async (req: Request, res: Response) => {
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

export const removeAttendance = async (req: Request, res: Response) => {
  const { classId } = req.params;

  try {
    const deletedAttendance = await ClassRecordModel.findByIdAndDelete(
      classId
    );
    if (!deletedAttendance)
      return res.status(404).json({ message: FM.classRecordNotFound });
    res.json({ message: FM.classRecordDeleteSuccess });
  } catch (error) {
    handleCatchError(res, error, FM.classRecordDeleteFailed);
  }
};