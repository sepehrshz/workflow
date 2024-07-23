import { Handle, Position } from "@xyflow/react";
import profile from "../assets/profile.png";

const UserNode = ({ userName }) => {
  return (
    <div className="flex items-center w-full">
      <Handle
        className="h-3 w-3 border-[3px] bg-white border-gray-500"
        type="source"
        position={Position.Right}
      />
      <div className="border w-10 h-10 border-gray-400 mr-1 flex justify-center items-center rounded-md p-1">
        <img className="h-3/4 w-3/4" src={profile} />
      </div>
      <div className="mr-2 w-3/4">{userName}</div>
    </div>
  );
};

export default UserNode;
