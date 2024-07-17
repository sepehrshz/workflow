import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
const SessionNode = ({userSession}) => {
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
            <div>{userSession.userName}</div>
            <div>{userSession.appName}</div>
            {userSession.status == "connected" ? 
                <svg className="absolute top-2 left-2" height="10" width="10">
                    <circle r="5" cx="5" cy="5" fill="green"/>
                </svg> : 
                <svg className="absolute top-2 left-2" height="10" width="10">
                    <circle r="5" cx="5" cy="5" fill="red"/>
                </svg>
            }
            <div className={click ? "border-2 rounded-md p-4 shadow-lg border-slate-400 absolute w-full left-0 top-full mt-2 transition-all duration-500"
                : "border-2 rounded-md p-4 shadow-lg border-slate-400 absolute w-full left-0 top-full mt-2 -translate-y-10 opacity-0 transition-all duration-500"}> 
                <div>IP: {userSession.clientIp}</div>
                <div>Duration: {userSession.duration}</div>
            </div>
        </div>
    );
}

export default SessionNode;