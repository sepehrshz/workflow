import SessionNode from "../Node/SessionNode";

export const CreateSessionNode = (
  loginIndex: number,
  index: number,
  userSession,
  loginNode,
) => {
  return {
    id: `session-${loginIndex}-${index}`,
    type: "default",
    data: {
      label: (
        <SessionNode
          key={`session-${loginIndex}-${index}`}
          userSession={userSession}
        />
      ),
    },
    position: {
      x: loginNode!.position.x + (index + 1) * 250 - 100,
      y: loginNode!.position.y,
    },
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
      border: "2px solid #cc33ff",
      borderRadius: "6px",
      visibility: "visible",
      backgroundColor: "#fff1fe",
      transition: "all 1s ease",
    },
  };
};
