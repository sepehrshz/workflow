import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import profile from "../assets/profile.png";

const SessionNode = ({ userSession }) => {
  const [click, setClick] = useState(false);
  return (
    <div
      className="flex items-center w-full px-2"
      onClick={() => setClick((prevClick) => !prevClick)}
    >
      <Handle
        className="h-4 w-4 border-4 bg-white border-[#cc33ff]"
        type="source"
        position={Position.Right}
      />
      <Handle
        className="h-4 w-4 border-4 bg-white border-[#cc33ff]"
        type="target"
        position={Position.Left}
      />
      <div className="border border-gray-400 mr-1 flex justify-center items-center rounded-md h-12 w-12">
        <img className="h-3/4 w-3/4" src={profile} />
      </div>
      <div className="w-3/4">{userSession.appName}</div>
      <div
        className={
          click
            ? "border-2 bg-white rounded-md p-4 shadow-lg border-slate-400 absolute w-full left-0 top-full mt-2 transition-all duration-500"
            : "border-2 bg-white rounded-md p-4 shadow-lg border-slate-400 absolute w-full left-0 top-full mt-2 -translate-y-10 opacity-0 transition-all duration-500"
        }
      >
        <div>IP: {userSession.clientIp}</div>
        <div>Duration: {userSession.duration}</div>
      </div>
    </div>
  );
};

export default SessionNode;
