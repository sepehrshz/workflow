import { Handle, Position } from "@xyflow/react";
import Expand from "../Expand";

export const CreateExpandNode = (
  prevloginIndex: number,
  yPosition: number,
  x: number,
  loginIndex: number,
  index: number,
  initialNodes,
  filteredSession,
  filteredLog,
  addEdge,
  setNodes,
  user: string,
  userSession,
) => {
  return {
    id: prevloginIndex + "-expand",
    data: {
      label: (
        <div
          className="w-full h-10 flex items-center justify-center"
          onClick={() =>
            Expand(
              loginIndex,
              index,
              true,
              initialNodes,
              filteredSession,
              filteredLog,
              addEdge,
              setNodes,
              user,
              userSession,
            )
          }
        >
          <Handle
            className="h-3 w-3 border-[3px] bg-white border-gray-400"
            type="source"
            position={Position.Right}
          />
          <Handle
            className="h-3 w-3 border-[3px] bg-white border-gray-400"
            type="target"
            position={Position.Left}
          />
          <div>Expand</div>
        </div>
      ),
    },
    position: { x: 900, y: yPosition + (x - 1) * 120 + 12.5 },
    sourcePosition: "right",
    targetPosition: "left",
    style: {
      width: "100px",
      height: "35px",
      fontSize: "13px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      border: "2px solid grey",
      borderRadius: "6px",
      visibility: "visible",
    },
  };
};
