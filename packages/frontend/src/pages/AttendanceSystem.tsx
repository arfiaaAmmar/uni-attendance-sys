import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllClassRecords, getLiveClassSessions, getRecentClasses } from "../api/class-record-api";
import { ClassRecord } from "shared-library/dist/types";
import { FM, PAGES_PATH } from "shared-library/dist/constants";
import { FeedbackMessage } from "@components/shared/FeedbackMessage";
import { formatTo12HourTime } from "@utils/constants";

const AttendanceSystem = () => {
  const [records, setRecords] = useState<ClassRecord[]>([])
  const [liveClasses, setLiveClasses] = useState<ClassRecord[]>([])
  const [recentSessions, setRecentSessions] = useState<ClassRecord[]>();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function handleDownloadPDF(_id?: string) {
    const selectedRecord = records?.find((record) => record._id === _id);
  };

  // TODO Will use this in future
  // useEffect(() => {
  //   async function fetchInitialData() {
  //     try {
  //       setLiveClasses(await getLiveClassSessions())
  //       setRecentSession(await getRecentClasses())
  //     } catch (error) {
  //       console.error("Error fetching class records:", error);
  //     }
  //   };

  //   fetchInitialData();
  // }, []);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        setRecords(await getAllClassRecords())
        // TODO These are just hacks. Will replace by above commented function
        const liveClasses = records.filter(record => record.status === "Ongoing")
        const currentTime = new Date();
        const thirtyMinutesAgo = new Date(currentTime.getTime() - 30 * 60000)
        const recentSessions = records.filter(record => {
          const endTime = new Date(record?.endTime!);
          return endTime >= thirtyMinutesAgo && endTime <= currentTime;
        });
        setRecentSessions(recentSessions)
        setLiveClasses(liveClasses)
      } catch (error) {
        setError(FM.errorFetchingData)
        console.error(FM.errorFetchingData)
      }
    }

    fetchInitialData()
  }, [])

  return (
    <>
      <h3 className="text-3xl font-bold m-4">Attendance System</h3>
      <div className="flex relative center gap-4 ml-4 mt-14 m-4">
        <FeedbackMessage {...{ success, error }} />
        <div className="bg-neutral-300 rounded-md p-4 w-full">
          <p className="text-2xl font-bold m-2">Class Session</p>
          <p className="mb-4">Shows the current running live class on your User Session</p>
          {liveClasses?.map((liveClass) => (
            <div key={liveClass?._id} className="bg-neutral-400 rounded-md p-2">
              <p className="text-2xl font-bold">{liveClass?.course}</p>
              <p className="text-lg font-bold">{liveClass?.classroom}</p>
              <div className="flex justify-between mt-8">
                <p>Attendance: {liveClass?.attendance?.length} student(s)</p>
                {/* <Link to={PAGES_PATH.classSession} className="bg-red-500 px-2 py-1 text-white font-bold">
                  End Class
                </Link> */}
              </div>
            </div>
          ))}
          <Link
            to={PAGES_PATH.classSession}
            className={`${liveClasses ? 'bg-green-500' : 'bg-neutral-400'} mt-2 mr-0 ml-auto block px-2 py-1 rounded-sm w-max`}
          >
            {liveClasses ? 'Go to Your Session' : 'Create Class'}
          </Link>
        </div>
        <div className="bg-neutral-300 rounded-md p-4 w-full">
          <p className="text-2xl font-bold m-2">Class History</p>
          <p>Shows recently ended classes</p>
          {recentSessions?.map((session) => (
            <div
              key={session?._id}
              className="bg-neutral-400 rounded-md p-2 my-2"
            >
              <p className="text-2xl font-bold">{session?.course}</p>
              <p className="text-lg font-bold">{session?.classroom}</p>
              <p>Time Ended : {formatTo12HourTime(session?.endTime!)}</p>
              <div className="flex mt-8 justify-end">
                <button
                  className="bg-orange-300 px-3 py-1"
                  onClick={() => handleDownloadPDF(session?._id)}
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
