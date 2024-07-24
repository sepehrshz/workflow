import { useState } from "react";
import SessionNode from "../components/SessionNode";
import UserNode from "../components/UserNode";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Link } from "react-router-dom";
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
      data: {
        label: (
          <Link
            className="w-full h-full flex justify-center items-center"
            to={`../user/${user}`}
          >
            <UserNode userName={user} />
          </Link>
        ),
      },
      position: { x: 100, y: (index + 1) * 150 },
      count: 0,
      lastIndex: 1,
      type: "output",
      targetPosition: "right",
      style: {
        width: "200px",
        height: "60px",
        border: "2px solid gray",
        borderRadius: "6px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "16px",
        backgroundColor: "#f5f5f5",
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
      type: "default",
      data: { label: <SessionNode userSession={userSession[index]} /> },
      position: { y: positionY, x: user.count * 300 + 100 },
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
  return (
    <ReactFlow nodes={nodes} edges={edges}>
      <Background color="grey" gap={16} />
      <Controls />
    </ReactFlow>
  );
}

export default SessionsFlow;
