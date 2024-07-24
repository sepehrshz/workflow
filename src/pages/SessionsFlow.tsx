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
  let prevUser = "";
  //add logs node
  userSession.forEach((log, index) => {
    const user = initialNodes.find((item) => item.id == log.userName);
    if (user) prevUser = user;
    if (user.count < 4) {
      const positionY = user.position.y;
      if (user.count === 0) {
        initialNodes.push({
          id: prevUser.id + "-expand",
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
          id: `e-${prevUser.id}-expand`,
          source: initialNodes[initialNodes.length - 2].id,
          target: prevUser.id + "-expand",
          animated: true,
        });
      }
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
      if (index + 1 !== userSession.length) {
        initialEdges.push({
          id: "e-" + user.id + "" + user.lastIndex + "-" + (user.lastIndex + 1),
          source: user.id + user.lastIndex,
          target: user.id + (user.lastIndex + 1),
          animated: true,
        });
        user.lastIndex++;
      }
    }
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
