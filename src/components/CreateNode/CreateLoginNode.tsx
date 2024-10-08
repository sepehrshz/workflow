import LogNode from "../Node/LogNode";

export const CreateLoginNode = (
  user: string,
  userFilterLog,
  index: number,
  x: number,
  yPosition: number,
) => {
  return {
    id: user + "-login-" + index,
    data: { label: <LogNode userLog={userFilterLog[index]} /> },
    position: { x: 650, y: yPosition + x * 80 },
    sourcePosition: "right",
    targetPosition: "left",
    style: {
      width: "200px",
      height: "60px",
      fontSize: "13px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      border: "2px solid #0ea5e9",
      borderRadius: "6px",
      visibility: "visible",
      backgroundColor: "#ecfeff",
    },
  };
};
