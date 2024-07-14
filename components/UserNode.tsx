import { Handle, Position } from "@xyflow/react";
import { Link } from "react-router-dom";

const UserNode = ({userName}) => {
    return (
        <Link to={`./user/${userName}`}>
            <div>
                <Handle
                className="h-4 w-4 border-4 bg-white border-gray-500"
                type="source"
                position={Position.Right}
                />
                <div>{userName}</div>
            </div>
        </Link>
    );
}

export default UserNode;