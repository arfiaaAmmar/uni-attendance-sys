// ClassRecordController.ts
import { handleCatchError } from "@helpers/shared-helpers";
import { ClassRecordModel } from "@models/model";
import { FM } from "shared-library/dist/constants";
import { Attendance, ClassRecord } from "shared-library/dist/types";
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
  const { classId } = req.params;

  try {
    const classRecord = await ClassRecordModel.find({ classId });
    if (!classRecord)
      return res.status(404).json({ message: FM.classRecordNotFound });
    res.json(classRecord);
  } catch (error) {
    handleCatchError(res, error, FM.classRecordCreationFailed);
  }
};

export const getAllClassRecords = async (req: Request, res: Response) => {
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
  const updatedData: Partial<ClassRecord> = req.body;

  try {
    let classRecord = await ClassRecordModel.findOne({ classId });
    if (!classRecord)
      return res.status(404).json({ message: FM.classRecordNotFound });

    // Iterate over each key in the updatedData object
    for (const key in updatedData) {
      if (key === 'attendance') {
        // Handle updating attendance separately
        const updatedAttendance: Attendance[] = updatedData.attendance || [];

        updatedAttendance.forEach(attendanceEntry => {
          if (attendanceEntry && classRecord?.attendance) {
            const existingEntryIndex = classRecord.attendance.findIndex(entry => entry.studentId === attendanceEntry.studentId);

            if (existingEntryIndex === -1) classRecord.attendance.push(attendanceEntry);
            else classRecord.attendance[existingEntryIndex] = attendanceEntry;
          }
        });
      } else {
        (classRecord as any)[key] = (updatedData as any)[key];
      }
    }

    await classRecord.save();
    res.json(classRecord);
  } catch (error) {
    handleCatchError(res, error, FM.errorUpdatingClassRecord);
  }
};


// TODO Not sure if to make another function for this
// export async function updateClassRecordSingleAttendance(req: Request, res: Response) {
//   const { classId } = req.params
//   const 
// }


export const removeClassRecord = async (req: Request, res: Response) => {
  const { classId } = req.params;

  try {
    const deletedRecord = await ClassRecordModel.findOneAndDelete({ classId });
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