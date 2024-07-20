import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import profile from "../assets/profile.png";
const LogNode = ({ userLog }) => {
  const [click, setClick] = useState(false);
  return (
    <div
      className="flex items-center w-full px-3"
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
      <div className="w-12 h-12 border border-gray-400 mr-1 flex justify-center items-center rounded-md">
        <img className="h-3/4 w-3/4" src={profile} />
      </div>
      <div className="w-3/4">
        <div>{userLog.result}</div>
        {userLog.status == "connected" ? (
          <svg className="absolute top-2 left-2" height="10" width="10">
            <circle r="5" cx="5" cy="5" fill="green" />
          </svg>
        ) : (
          <svg className="absolute top-2 left-2" height="10" width="10">
            <circle r="5" cx="5" cy="5" fill="red" />
          </svg>
        )}
      </div>
      <div
        className={
          click
            ? "border-2 bg-white rounded-md p-4 shadow-lg border-slate-400 absolute w-full left-0 top-full mt-2 transition-all duration-500"
            : "border-2 bg-white rounded-md p-4 shadow-lg border-slate-400 absolute w-full left-0 top-full mt-2 -translate-y-10 opacity-0 transition-all duration-500"
        }
      >
        <div>IP: {userLog.clientIp}</div>
        <div className="mt-2">IpDesc: {userLog.clientIpDesc}</div>
        <div>Time: {userLog.createdTime}</div>
      </div>
    </div>
  );
};

export default LogNode;
