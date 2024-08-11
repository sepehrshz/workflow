import { Handle, Position } from "@xyflow/react";
const LogCountNode = ({
  logCount,
  sessionCount,
}: {
  logCount: number;
  sessionCount: number;
}) => {
  return (
    <div className="flex items-center w-full px-1">
      <Handle
        className="h-3 w-3 border-[3px] bg-white border-[#03a5e9]"
        type="target"
        position={Position.Left}
      />
      <Handle
        className="h-3 w-3 border-[3px] bg-white border-[#03a5e9]"
        type="source"
        position={Position.Right}
      />
      <div className="w-full flex flex-col justify-center items-center rounded-md">
        <div>Logs: {logCount}</div>
        <div>Sessions: {sessionCount}</div>
      </div>
    </div>
  );
};

export default LogCountNode;
