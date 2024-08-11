import LogCountNode from "../Node/LogCountNode";

type ShowLogsFunction = (user: string, position: number) => void;

export const CreateUserStatsNode = (
  user: string,
  index: number,
  logCount: number,
  sessionCount: number,
  showLogs: ShowLogsFunction,
) => {
  return {
    id: user + "-logs",
    data: {
      label: (
        <div onClick={() => showLogs(user, ((index % 4) + 1) * 150 - 20)}>
          <LogCountNode logCount={logCount} sessionCount={sessionCount} />
        </div>
      ),
    },
    position: { x: 400, y: ((index % 4) + 1) * 150 - 20 },
    count: 0,
    targetPosition: "left",
    sourcePosition: "right",
    style: {
      width: "150px",
      height: "60px",
      border: "2px solid #03a5e9",
      borderRadius: "6px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "16px",
      backgroundColor: "#eef2ff",
    },
  };
};
