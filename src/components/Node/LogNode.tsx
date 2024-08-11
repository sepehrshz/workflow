import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import profile from "../../assets/profile.png";
import arrow from "../../assets/arrow.png";
import { useNavigate } from "react-router-dom";
import { Log } from "../../types/log";
const LogNode = ({ userLog }: { userLog: Log }) => {
  const [click, setClick] = useState(false);
  const date = new Date(userLog.createdTime);
  const navigate = useNavigate();

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const formattedDate = date.toLocaleString("en-US", options);
  const navigateToUser = (userLog: Log) => {
    navigate(`/user/${userLog.userName}`, {
      state: { message: userLog.createdTime },
    });
  };
  return (
    <div
      className="flex items-center w-full px-1"
      onClick={() => setClick((prevClick) => !prevClick)}
    >
      <Handle
        className="h-3 w-3 border-[3px] bg-white border-[#0ea5e9]"
        type="source"
        position={Position.Right}
      />
      <Handle
        className="h-3 w-3 border-[3px] bg-white border-[#03a5e9]"
        type="target"
        position={Position.Left}
      />
      <div className="w-10 h-10 border border-gray-400 mr-1 flex justify-center items-center rounded-md">
        <img className="h-[60%] w-[60%]" src={profile} />
      </div>
      <div className="w-3/4 flex items-center">
        <div className="h-16 w-full flex justify-center items-center text-[16px]">
          {userLog.result}
        </div>
        <img
          className={
            click
              ? "h-8 w-7 relative right-0 mt-1 transition-all rotate-180 duration-500"
              : "h-8 w-7 relative right-0 mt-1 transition-all duration-500"
          }
          src={arrow}
        />
      </div>
      <div
        className={
          click
            ? "border-2 bg-white rounded-md p-4 shadow-lg border-slate-400 absolute w-full left-0 top-full mt-2 transition-all duration-500"
            : "border-2 bg-white rounded-md p-4 shadow-lg border-slate-400 absolute w-full left-0 top-full mt-2 -translate-y-10 opacity-0 invisible transition-all duration-500"
        }
      >
        <div>IP: {userLog.clientIp}</div>
        <div className="mt-1">🕓{formattedDate}</div>
        <button
          onClick={() => navigateToUser(userLog)}
          className="absolute flex justify-center items-center h-5 w-5 p-1 top-1 right-1 bg-gray-300 rounded-[4px]"
        >
          ...
        </button>
      </div>
    </div>
  );
};

export default LogNode;
