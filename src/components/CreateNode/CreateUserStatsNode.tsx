import LogCountNode from "../Node/LogCountNode";

type ShowLogsFunction = (user: string, position: number, open: boolean) => void;

export const CreateUserStatsNode = (
  user: string,
  index: number,
  logCount: number,
  sessionCount: number,
  showLogs: ShowLogsFunction,
) => {
  let open = true;
  const toggle = () => {
    if (open) {
      showLogs(user, ((index % 4) + 1) * 150 - 20, true, index);
      open = false;
    } else {
      showLogs(user, ((index % 4) + 1) * 150 - 20, false, index);
      open = true;
    }
  };
  return {
    id: user + "-stats",
    data: {
      label: (
        <div onClick={() => toggle()}>
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
