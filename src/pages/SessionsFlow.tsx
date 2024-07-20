import { useState } from "react";
import SessionNode from "../components/SessionNode";
import UserNode from "../components/UserNode";
import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import userSession from "../assets/sessions.json";

function SessionsFlow() {
  const initialNodes = [],
    initialEdges = [];

  //sort logs by created time
  userSession.sort((a, b) => new Date(a.createdTime) - new Date(b.createdTime));

  //get all usernames
  const userNames = userSession.reduce((acc, item) => {
    if (!acc.includes(item.userName)) {
      acc.push(item.userName);
    }
    return acc;
  }, []);

  //add user nodes to initialNodes array
  userNames.forEach((user, index) => {
    initialNodes.push({
      id: user,
      data: { label: <UserNode userName={user} /> },
      position: { x: 300, y: (index + 1) * 205 },
      count: 0,
      lastIndex: 1,
      type: "output",
      targetPosition: "right",
      style: {
        width: "200px",
        height: "70px",
        border: "2px solid gray",
        borderRadius: "6px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "16px",
      },
    });
    initialEdges.push({
      id: user,
      source: user,
      target: user + "1",
      animated: true,
    });
  });

  //add logs node
  userSession.forEach((log, index) => {
    const user = initialNodes.find((item) => item.id == log.userName);
    user.count++;
    const positionY = user.position.y;
    initialNodes.push({
      id: user.id + user.count,
      type: "custom",
      data: { label: <SessionNode userSession={userSession[index]} /> },
      position: { y: positionY, x: (user.count + 1) * 300 },
      sourcePosition: "right",
      targetPosition: "left",
      style: {
        width: "200px",
        height: "70px",
        fontSize: "13px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        border: "2px solid #cc33ff",
        borderRadius: "6px",
        visibility: "visible",
      },
    });
    if (index + 1 !== userSession.length) {
      initialEdges.push({
        id: user.id + "-e" + user.lastIndex + "-" + (user.lastIndex + 1),
        source: user.id + user.lastIndex,
        target: user.id + (user.lastIndex + 1),
        animated: true,
      });
      user.lastIndex++;
    }
  });
  console.log(initialEdges);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  return <ReactFlow nodes={nodes} edges={edges} />;
}

export default SessionsFlow;
