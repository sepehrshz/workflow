import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
function Navigator({ children }: { children: ReactNode }) {
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.split("/")[1] === "user") setActive("");
    else if (location.pathname.split("/")[1] === "logs") setActive("logs");
    else if (location.pathname.split("/")[1] === "sessions")
      setActive("sessions");
    setActive("sesssions");
  }, []);
  const changeActive = (arg: string) => {
    setActive(arg);
    navigate(`/${arg}`, { replace: true });
  };
  return (
    <div className="w-full h-[100vh]">
      <span className="isolate fixed top-10 left-10 z-40 inline-flex rounded-md shadow-sm">
        <button
          onClick={() => changeActive("logs")}
          type="button"
          className={`relative -ml-px rounded-l-md border border-gray-300 w-20 flex justify-center items-center py-2 text-sm font-medium text-gray-700
            ${active === "logs" ? "bg-gray-100" : "bg-white hover:bg-gray-50"}`}
        >
          Logs
        </button>
        <button
          onClick={() => changeActive("sessions")}
          type="button"
          className={`relative -ml-px rounded-r-md border border-gray-300 w-20 flex justify-center items-center py-2 text-sm font-medium text-gray-700 
            ${active === "sessions" ? "bg-gray-100" : "bg-white hover:bg-gray-50"}`}
        >
          Sessions
        </button>
      </span>
      {children}
    </div>
  );
}

export default Navigator;
