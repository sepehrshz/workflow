import { useEffect, useState } from "react";
import SessionNode from "../components/SessionNode";
import UserNode from "../components/UserNode";
import {
  ReactFlow,
  Background,
  Controls,
  Position,
  Handle,
} from "@xyflow/react";
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
      position: { x: 75, y: (index + 1) * 150 },
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
  //add logs nodes
  userSession.forEach((log, index) => {
    const user = initialNodes.find((item) => item.id == log.userName);
    if (user.count < 4) {
      const positionY = user.position.y;
      user.count++;
      initialNodes.push({
        id: user.id + user.count,
        type: "default",
        data: { label: <SessionNode userSession={userSession[index]} /> },
        position: { y: positionY, x: user.count * 250 + 75 },
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
      if (index !== userSession.length - 1) {
        if (user.lastIndex > 1) {
          initialEdges.push({
            id:
              "e-" + user.id + "" + (user.lastIndex - 1) + "-" + user.lastIndex,
            source: user.id + (user.lastIndex - 1),
            target: user.id + user.lastIndex,
            animated: true,
          });
        }
        user.lastIndex++;
      }
    }
  });
  //add expand nodes
  userNames.forEach((user) => {
    const positionY = initialNodes.find((item) => item.id === user).position.y;
    initialNodes.push({
      id: user + "-expand",
      type: "input",
      data: {
        label: (
          <div
            className="w-full h-10 flex items-center justify-center"
            // onClick={() => expand(loginIndex, index, true)}
          >
            <Handle
              className="h-3 w-3 border-[3px] bg-white border-gray-400"
              type="target"
              position={Position.Left}
            />
            <div>Expand</div>
          </div>
        ),
      },
      position: { x: 1325, y: positionY + 12.5 },
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
    });
    initialEdges.push({
      id: `e-${user}-expand`,
      source: `${user}4`,
      target: user + "-expand",
      animated: true,
    });
  });

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
