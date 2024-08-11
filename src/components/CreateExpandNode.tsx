import { Handle, Position } from "@xyflow/react";

export const CreateExpandNode = (
  prevloginIndex: number,
  yPosition: number,
  x: number,
) => {
  return {
    id: prevloginIndex + "-expand",
    data: {
      label: (
        <div
          className="w-full h-10 flex items-center justify-center"
          // onClick={() => expand(loginIndex, index, true)}
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
