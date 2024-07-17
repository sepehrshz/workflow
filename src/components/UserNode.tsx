import { Handle, Position } from "@xyflow/react";

const UserNode = ({userName}) => {
    return (
        <div>
            <Handle
            className="h-4 w-4 border-4 bg-white border-gray-500"
            type="source"
            position={Position.Right}
            />
            <div>{userName}</div>
        </div>
    );
}

export default UserNode;