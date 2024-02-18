import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllClassRecords, getLiveClassSessions, getRecentClasses } from "../api/class-record-api";
import { ClassRecord } from "shared-library/dist/types";
import { PAGES_PATH } from "shared-library/dist/constants";

const AttendanceSystem = () => {
  // const [records, setRecord] = useState<ClassRecord[]>();
  const [recentSession, setRecentSession] = useState<ClassRecord[]>();
  const [liveClasses, setLiveClasses] = useState<ClassRecord[]>([])

  async function handleDownloadPDF(_id?: string) {
    const selectedRecord = recentSession?.find((record) => record._id === _id);
  };

  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLiveClasses(await getLiveClassSessions())
        setRecentSession(await getRecentClasses())
      } catch (error) {
        console.error("Error fetching class records:", error);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <>
      <h3 className="text-3xl font-bold m-4">Attendance System</h3>
      <div className="flex relative center gap-4 ml-4 mt-14 m-4">
        <div className="bg-neutral-300 rounded-md p-4 w-full">
          <p className="text-2xl font-bold m-2">Class Session</p>
          <p>Shows the current running live class on your User Session</p>
          {liveClasses?.map((liveClass) => (
            <div key={liveClass?._id} className="bg-neutral-400 rounded-md p-2">
              <p className="text-2xl font-bold">{liveClass?.course}</p>
              <p className="text-lg font-bold">{liveClass?.classroom}</p>
              <div className="flex justify-between mt-8">
                <p>Attendance: {liveClass?.attendance?.length} student(s)</p>
                <button className="bg-red-500 px-2 py-1 text-white font-bold">
                  End Class
                </button>
              </div>
            </div>
          ))}
          <Link
            to={PAGES_PATH.classSession}
            className="bg-neutral-400 mt-2 mr-0 ml-auto block px-2 py-1 rounded-sm w-max"
          >
            Create Class
          </Link>
        </div>
        <div className="bg-neutral-300 rounded-md p-4 w-full">
          <p className="text-2xl font-bold m-2">Class History</p>
          <p>Shows the current running live class on your User Session</p>
          {recentSession?.map((prevRecord) => (
            <div
              key={prevRecord?._id}
              className="bg-neutral-400 rounded-md p-2 my-2"
            >
              <p className="text-2xl font-bold">{prevRecord?.course}</p>
              <p className="text-lg font-bold">{prevRecord?.classroom}</p>
              <div className="flex justify-end mt-8">
                <button
                  className="bg-orange-300 px-3 py-1"
                  onClick={() => handleDownloadPDF(prevRecord?._id)}
                >
                  View | Dwnld | Print
                </button>
              </div>
            </div>
          ))}
          <Link
            to={PAGES_PATH.classHistory}
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
