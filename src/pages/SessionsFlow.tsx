import { useEffect, useState } from "react";
import SessionNode from "../components/SessionNode";
import UserNode from "../components/UserNode";
import {
  ReactFlow,
  Background,
  Controls,
  Position,
  Handle,
  useEdgesState,
  useNodesState,
  getConnectedEdges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Link } from "react-router-dom";
import userSession from "../assets/sessions.json";
import { useCallback } from "react";
import { Session } from "../types/session";

const SessionsFlow = () => {
  interface Node {
    id: string;
    type?: string;
    data: { label: ReactElement };
    position: { x: number; y: number };
    targetPosition?: string;
    sourcePosition?: string;
    style?: { [key: string]: string | number };
    count?: number;
  }

  interface Edge {
    type?: "smoothstep";
    id: string;
    source: string;
    target: string;
    animated: boolean;
  }
  const initialNodes: Node[] = [],
    initialEdges: Edge[] = [];

  const addEdge = (newEdge: Edge) => {
    setEdges((prev) => [...prev, newEdge]);
  };
  //sort logs by created time
  userSession.sort((a, b) => new Date(a.createdTime) - new Date(b.createdTime));

  //get all usernames
  const userNames = [...new Set(userSession.map((item) => item.userName))];

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
  });

  //add logs nodes
  userSession.forEach((log, index) => {
    const user = initialNodes.find((item) => item.id == log.userName);
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
        if (user.count > 1) {
          initialEdges.push({
            id: "e-" + user.id + "" + (user.count - 1) + "-" + user.count,
            source: user.id + (user.count - 1),
            target: user.id + user.count,
            animated: true,
          });
        }
      }
    }
  });

  // expand function
  let userCount = 1;
  const expand = (user: Node, firstTime: boolean) => {
    const expandNodeIndex = initialNodes.findIndex(
      (item) => item.id === user.id + "-expand",
    );
    initialNodes.splice(expandNodeIndex, 1);
    const filteredSession = userSession.filter(
      (session) => session.userName === user.id,
    );
    filteredSession.forEach((session: Session, index) => {
      if (index === 0) {
        userCount = 1;
      }
      const sessionNodeId = `${user.id}${userCount}`;
      //check if it is duplicate node
      if (
        !initialNodes.some((node) => node.id === sessionNodeId) &&
        userCount !== 0
      ) {
        //add session nodes
        initialNodes.push({
          id: `${user.id}${userCount}`,
          type: "default",
          data: {
            label: (
              <SessionNode
                key={`${user.id}-${index}`}
                userSession={filteredSession[index]}
              />
            ),
          },
          position: {
            x: userCount * 250,
            y: user.position.y,
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
            backgroundColor: "#fff1fe",
            transition: "all 1s ease",
            opacity: 0,
          },
        });
        setNodes(initialNodes);
        setTimeout(() => {
          // initialNodes[initialNodes.length - 1].position.x += 75;
          // initialNodes[initialNodes.length - 1].style!.opacity = 1;
          const lastAddNode = initialNodes.find(
            (item) => item.id === sessionNodeId,
          );
          lastAddNode!.position.x += 75;
          lastAddNode!.style!.opacity = 1;
          setNodes(initialNodes);
        }, 10);
      }
      if (
        !edges.some(
          (edge) => edge.id === `e-${user.id}${userCount - 1}-${userCount}`,
        ) &&
        userCount > 1 &&
        firstTime
      ) {
        const newEdge = {
          id: `e-${user.id}${userCount - 1}-${userCount}`,
          source: user.id + (userCount - 1),
          target: user.id + userCount,
          animated: true,
        };
        addEdge(newEdge);
      }
      userCount++;
    });
    // shrink node
    initialNodes.push({
      id: user.id + "-shrink",
      data: {
        label: (
          <div
            className="w-full h-10 flex items-center justify-center"
            onClick={() => shrink(user, userCount)}
          >
            <Handle
              className="h-3 w-3 border-[3px] bg-white border-gray-400"
              type="target"
              position={Position.Left}
            />
            <div>Shrink</div>
          </div>
        ),
      },
      position: {
        x: userCount * 250,
        y: user.position.y + 10,
      },
      targetPosition: "left",
      type: "output",
      style: {
        width: "100px",
        height: "40px",
        fontSize: "13px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        border: "2px solid grey",
        borderRadius: "6px",
        visibility: "visible",
        transition: "all 1s ease",
        opacity: 0,
      },
    });
    setNodes(initialNodes);
    setTimeout(() => {
      const shrinkNode = initialNodes.find(
        (item) => item.id === user.id + "-shrink",
      );
      shrinkNode!.position.x += 75;
      shrinkNode!.style!.opacity = 1;
      setNodes(initialNodes);
    }, 10);
    if (firstTime) {
      const shrinkEdge = {
        id: `e-${user.id}-shrink`,
        source: initialNodes[initialNodes.length - 2].id,
        target: `${user.id}-shrink`,
        animated: true,
      };
      addEdge(shrinkEdge);
    }
  };

  const shrink = (user: Node, index: number) => {
    const shrinkNodeIndex = initialNodes.findIndex(
      (item) => item.id === user.id + "-shrink",
    );
    //delete shrink node
    initialNodes.splice(shrinkNodeIndex, 1);
    //delete expanded nodes
    while (index - 1 > 4) {
      initialNodes.splice(
        initialNodes.findIndex((item) => item.id === `${user.id}${index - 1}`),
        1,
      );
      index--;
    }
    //push expand node
    initialNodes.push({
      id: user.id + "-expand",
      data: {
        label: (
          <div
            className="w-full h-10 flex items-center justify-center"
            onClick={() => expand(user, false)}
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
      position: {
        x: (user.count! + 1) * 250 + 225,
        y: user.position.y + 12.5,
      },
      type: "input",
      style: {
        width: "100px",
        height: "40px",
        fontSize: "13px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        border: "2px solid grey",
        borderRadius: "6px",
        visibility: "visible",
        opacity: 0,
        transition: "all 1s ease",
      },
    });
    setNodes(initialNodes);
    setTimeout(() => {
      initialNodes[initialNodes.length - 1].position.x -= 150;
      initialNodes[initialNodes.length - 1].style!.opacity = 1;
      setNodes(initialNodes);
    }, 10);
  };

  //add expand nodes
  userNames.forEach((user) => {
    const findUser = initialNodes.find((item) => item.id === user) as Node;
    initialNodes.push({
      id: user + "-expand",
      type: "input",
      data: {
        label: (
          <div
            className="w-full h-10 flex items-center justify-center"
            onClick={() => expand(findUser, true)}
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
      position: {
        x: (findUser.count! + 1) * 250 + 75,
        y: findUser.position.y + 12.5,
      },
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
        transition: "all 1s ease",
        opacity: 1,
      },
    });
    initialEdges.push({
      id: `e-${user}-expand`,
      source: `${user}4`,
      target: user + "-expand",
      animated: true,
    });
  });

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    console.log(edges);
  }, [edges]);

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
      <Background color="grey" gap={16} />
      <Controls />
    </ReactFlow>
  );
};

export default SessionsFlow;
