import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IClassRecord } from "shared-library/types";
import { getAllClassRecords } from "../api/class-record-api";

const AttendanceSystem = () => {
  const [records, setRecord] = useState<IClassRecord[]>();
  const [recent, setRecent] = useState<IClassRecord[]>();
  const [liveClasses, setLiveClasses] = useState<IClassRecord[]>()

  const handleDownloadPDF = async (_id?: string) => {
    const selectedRecord = records?.find((record) => record.classId === _id);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllClassRecords();

        if (data && data.length > 0) {
          const currentTime = new Date();

          const endedClasses = data.filter((record: IClassRecord) => {
            const endTime = new Date(`${record.date} ${record.endTime}`);
            return endTime < currentTime;
          });

          // TODO: Should be placed in the backend as endpoint i.e getLiveClassSession
          // Create API to fetch liveClassSession
          const liveClasses = data.filter((record: IClassRecord) => {
            const endTime = new Date(`${record.date} ${record.endTime}`);
            return endTime >= currentTime;
          });

          setRecent(endedClasses);
          setLiveClasses(liveClasses)
        }
      } catch (error) {
        console.error("Error fetching class records:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h3 className="text-3xl font-bold m-4">Attendance System</h3>
      <div className="flex center gap-4 ml-4 mt-14 m-4">
        <div className="bg-neutral-300 rounded-md p-4 w-full">
          <p className="text-2xl font-bold m-2">Class Session</p>
          <p>Shows the current running live class on your User Session</p>
          {liveClasses?.map((liveClass) => (
            <div className="bg-neutral-400 rounded-md p-2">
              <p className="text-2xl font-bold">{liveClass.course}</p>
              <p className="text-lg font-bold">{liveClass.classroom}</p>
              <div className="flex justify-between mt-8">
                <p>Attendance: 23/30</p>
                <button className="bg-red-500 px-2 py-1 text-white font-bold">
                  End Class
                </button>
              </div>
            </div>
          ))}
          <Link
            to="/admin/attendance_system/class_session"
            className="bg-neutral-400 mt-2 mr-0 ml-auto block px-2 py-1 rounded-sm w-max"
          >
            See More
          </Link>
        </div>
        <div className="bg-neutral-300 rounded-md p-4 w-full">
          <p className="text-2xl font-bold m-2">Class History</p>
          <p>Shows the current running live class on your User Session</p>
          {recent?.map((prevRecord) => (
            <div className="bg-neutral-400 rounded-md p-2 my-2">
              <p className="text-2xl font-bold">{prevRecord.course}</p>
              <p className="text-lg font-bold">{prevRecord.classroom}</p>
              <div className="flex justify-end mt-8">
                <button
                  className="bg-orange-300 px-3 py-1"
                  onClick={() => handleDownloadPDF(prevRecord.classId)}
                >
                  View | Dwnld | Print
                </button>
              </div>
            </div>
          ))}
          <Link
            to="/admin/attendance_system/class_history"
            className="bg-neutral-400 mt-2 mr-0 ml-auto block px-2 py-1 rounded-sm w-max"
          >
            See More
          </Link>
        </div>
      </div>
    </>
  );
};

export default AttendanceSystem;
