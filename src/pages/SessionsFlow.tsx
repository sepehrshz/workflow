import { Node } from "../types/node";
import { Edge } from "../types/edge";
import SessionNode from "../components/SessionNode";
import { useState } from "react";
import UserNode from "../components/UserNode";
import {
  ReactFlow,
  Background,
  Controls,
  useEdgesState,
  useNodesState,
  getConnectedEdges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Link } from "react-router-dom";
import userSession from "../assets/sessions.json";
import { useCallback, useEffect } from "react";
import { Session } from "../types/session";
import Pagination from "../layouts/Pagination";

const SessionsFlow = () => {
  const [startIndex, setStartIndex] = useState(0);
  const handleChangePage = (index: number) => {
    setStartIndex((index - 1) * 4);
  };
  const initialNodes: Node[] = [],
    initialEdges: Edge[] = [];
  const addEdge = (newEdge: Edge) => {
    setEdges((prev) => [...prev, newEdge]);
  };
  const userList: string[] = [];
  //sort logs by created time
  userSession.sort((a, b) => new Date(a.createdTime) - new Date(b.createdTime));

  //get all usernames
  const userNames = [...new Set(userSession.map((item) => item.userName))];
  useEffect(() => {
    //add user nodes to initialNodes array
    initialNodes.splice(0, initialNodes.length);
    setNodes(initialNodes);
    userList.splice(0, userList.length);
    userNames.forEach((user, index) => {
      if (index <= startIndex + 3 && index >= startIndex) {
        userList.push(user);
        if (!initialNodes.some((item) => item.id === user)) {
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
            position: { x: 75, y: ((index % 4) + 1) * 150 },
            count: 0,
            sessionNum: 4,
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
        }
      }
    });

    //add logs nodes
    userSession.forEach((log, index) => {
      const user = initialNodes.find((item) => item.id == log.userName);
      if (userList.includes(user?.id)) {
        if (user.count < user.sessionNum) {
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
            if (
              user.count > 1 &&
              !initialEdges.some(
                (item) =>
                  item.id ===
                  "e-" + user.id + "" + (user.count - 1) + "-" + user.count,
              )
            ) {
              // initialEdges.push({
              initialEdges.push({
                id: "e-" + user.id + "" + (user.count - 1) + "-" + user.count,
                source: user.id + (user.count - 1),
                target: user.id + user.count,
                animated: true,
                // });
              });
              setEdges(initialEdges);
            }
          }
        }
      }
    });
  }, [startIndex]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  useEffect(() => {
    console.log(edges);
  });
  const onNodesDelete = useCallback(
    (deleted) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter(
            (edge: Edge) => !connectedEdges.includes(edge),
          );

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            })),
          );

          return [...remainingEdges, ...createdEdges];
        }, edges),
      );
    },
    [nodes, edges, setEdges],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesDelete={onNodesDelete}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    >
      <Pagination
        onChangePage={handleChangePage}
        userNumber={userNames.length}
      />
      <Background color="grey" gap={16} />
      <Controls />
    </ReactFlow>
  );
};

export default SessionsFlow;
