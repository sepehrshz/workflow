import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
const LogNode = ({userLog}) => {
    const [click, setClick] = useState(false);
    return (
        <div onClick={() => setClick(prevClick => !prevClick)}>
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
            <div>{userLog.userName}</div>
            <div>{userLog.result ? `Action: ${userLog.result}` : 'Action: login'}</div>
            {userLog.status == "connected" ? 
                <svg className="absolute top-2 left-2" height="10" width="10">
                    <circle r="5" cx="5" cy="5" fill="green"/>
                </svg> : 
                <svg className="absolute top-2 left-2" height="10" width="10">
                    <circle r="5" cx="5" cy="5" fill="red"/>
                </svg>
            }
            <div className={click ? "border-2 rounded-md p-4 shadow-lg border-slate-400 absolute w-full left-0 top-full mt-2 transition-all duration-500"
                : "border-2 rounded-md p-4 shadow-lg border-slate-400 absolute w-full left-0 top-full mt-2 -translate-y-10 opacity-0 transition-all duration-500"}> 
                <div>IP: {userLog.clientIp}</div>
                <div className="mt-2">IpDesc: {userLog.clientIpDesc}</div>
                <div>Time: {userLog.createdTime}</div>
            </div>
        </div>
    );
}

export default LogNode;