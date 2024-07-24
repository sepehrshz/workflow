import { ReactNode, useEffect, useState } from "react";
import {
  Link,
  Navigate,
  Location,
  useNavigate,
  useLocation,
} from "react-router-dom";
function Navigator({ children }: { children: ReactNode }) {
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.split("/")[1] === "user") setActive("");
  }, [location.pathname]);
  const changeActive = (arg) => {
    setActive(arg);
    navigate(`/${arg}`, { replace: true });
  };
  return (
    <div className="w-full h-[100vh]">
      <span className="isolate fixed top-10 left-10 z-40 inline-flex rounded-md shadow-sm">
        <button
          onClick={() => changeActive("logs")}
          type="button"
          className={`relative -ml-px rounded-l-md border border-gray-300 bg-white w-20 flex justify-center items-center py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
            active !== "logs" ? "" : "bg-gray-100"
          }`}
        >
          Logs
        </button>
        <button
          onClick={() => changeActive("sessions")}
          type="button"
          className={`relative -ml-px rounded-r-md border border-gray-300 bg-white w-20 flex justify-center items-center py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
            active !== "sessions" ? "" : "bg-gray-100"
          }`}
        >
          Sessions
        </button>
      </span>
      {children}
    </div>
  );
}

export default Navigator;
