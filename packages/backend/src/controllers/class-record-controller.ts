// ClassRecordController.ts
import { handleCatchError } from "@helpers/shared-helpers";
import { ClassRecordModel } from "@models/model";
import { FM } from "packages/shared-library/src/constants";
import { ClassRecord, IClassRecordModel } from "packages/shared-library/src/types";
import { Request, Response } from "express";

  const post = async (req: Request, res: Response) => {
    try {
      const input: ClassRecord = req.body;
      const newClassRecord = await ClassRecordModel.create({ ...input });
      res.status(201).json(newClassRecord);
    } catch (error) {
      handleCatchError(res, error, FM.classRecordCreationFailed);
    }
  };

  const postAttendance = async (req: Request, res: Response) => {
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

  const getRecord = async (req: Request, res: Response) => {
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

  const getAll = async (req: Request, res: Response) => {
    try {
      const classRecord = await ClassRecordModel.find({}, { password: 0 }).exec();
      if (!classRecord)
        return res.status(404).json({ message: FM.classRecordNotFound });
      res.json(classRecord);
    } catch (error) {
      handleCatchError(res, error, FM.classRecordRetrievalFailed);
    }
  };

  const getLiveSessions = async (req: Request, res: Response) => {
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

  const updateRecord = async (req: Request, res: Response) => {
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

  const removeRecord = async (req: Request, res: Response) => {
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

  const removeAttendance = async (req: Request, res: Response) => {
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

const ClassRecordController = {
  post,
  postAttendance,
  getRecord,
  getAll,
  getLiveSessions,
  updateRecord,
  removeRecord,
  removeAttendance,
}

export default ClassRecordController;
