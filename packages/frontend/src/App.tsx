import "tailwindcss/tailwind.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { adminRoutes } from "./routes/routes";
import { PAGES_PATH } from "shared-library/dist/constants";
import Login from "@pages/Login";
import Sidebar from "@components/shared/Sidebar";
import AttendanceSystem from "@pages/AttendanceSystem";
import ClassRecords from "@pages/ClassRecord";
import ClassSession from "@pages/ClassSession";
import StudentDatabase from "@pages/StudentDatabase";
import { authoriseUser, getUserSessionData } from "@api/admin-api";
import { PAGES_PATH } from "shared-library/dist/constants";

function App(): JSX.Element {
  const [sidebar, setSidebar] = useState(true);
  const userRole = getUserSessionData()
  const navigate = useNavigate();

  useEffect(() => {
    if (!userRole) navigate(PAGES_PATH.login);
    else navigate(PAGES_PATH.studentDB);

  }, []);

  return (
    <Routes>
      <Route path={PAGES_PATH.login} element={<Login />} />
      <Route
        path="/admin/*"
        element={<AdminRoutes sidebar={sidebar} setSidebar={setSidebar} />}
      />
    </Routes>
  );
}

type AdminRoutes = {
  sidebar: boolean;
  setSidebar: Dispatch<SetStateAction<boolean>>;
};
type AdminRoutesProps = Readonly<AdminRoutes>;

function AdminRoutes({ sidebar, setSidebar }: AdminRoutesProps): JSX.Element {
  const location = useLocation();
  const { studentDB, attendanceSys, classSession, classHistory } = PAGES_PATH;

  const renderContent = () => {
    switch (location.pathname) {
      case studentDB:
        return <StudentDatabase />;
      case attendanceSys:
        return <AttendanceSystem />;
      case classSession:
        return <ClassSession />;
      case classHistory:
        return <ClassRecords />;
      default:
        return <div>Invalid page</div>;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar items={adminRoutes} sidebar={sidebar} setSidebar={setSidebar} />
      <IconButton
        className={`absolute top-0 left-0 ${sidebar ? "hidden" : "visible"}`}
        onClick={() => setSidebar(true)}
      >
        <MenuIcon fontSize="large" className="text-black" />
      </IconButton>
      <div className="h-screen w-full overflow-auto">
        <main className="flex-grow">{renderContent()}</main>
      </div>
    </div>
  );
}

export default App;
