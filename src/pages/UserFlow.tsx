import {
  ReactFlow,
  Controls,
  Background,
  useEdgesState,
  useNodesState,
  getConnectedEdges,
  getOutgoers,
  getIncomers,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import userLogs from "../assets/userLogs.json";
import userSession from "../assets/sessions.json";
import { useParams, useLocation } from "react-router-dom";
import { ReactElement, useCallback, useEffect } from "react";
import UserNode from "../components/UserNode";
import LogNode from "../components/LogNode";
import SessionNode from "../components/SessionNode";

function UserFlow() {
  const { id } = useParams();
  const location = useLocation();

  interface Node {
    id: string;
    type?: string;
    data: { label: ReactElement };
    position: { x: number; y: number };
    targetPosition?: string;
    sourcePosition?: string;
    style?: { [key: string]: string | number };
  }
  interface Edge {
    type?: "smoothstep";
    id: string;
    source: string;
    target: string;
    animated: boolean;
  }

  const addEdge = (newEdge: Edge) => {
    setEdges((prev) => [...prev, newEdge]);
  };

  //   const deleteEdge = (index: number) => {
  //     // const newEdges = edges.filter((edge: Edge) => edge.id !== id);
  //     edges.splice(index, 1);
  //     console.log(edges);
  //     setEdges(edges);
  //     console.log(edges);
  //   };

  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];

  userLogs.sort(
    (a, b) =>
      new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime(),
  );
  userSession.sort(
    (a, b) =>
      new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime(),
  );

  const filteredLog = userLogs.filter((item) => item.userName === id);
  const filteredSession = userSession.filter((item) => item.userName === id);

  const windowHeight = window.innerHeight;
  const centerY = windowHeight / 2;

  initialNodes.push({
    id: id!,
    data: { label: <UserNode userName={id} /> },
    position: { x: 100, y: centerY },
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
  let loginCount =
      (-1 *
        (filteredLog.filter((item) => item.result === "login").length - 1)) /
      2,
    prevloginIndex = 0;

  filteredLog.forEach((log, index) => {
    if (log.result === "login") {
      prevloginIndex = index;
      initialNodes.push({
        id: index.toString(),
        data: { label: <LogNode userLog={filteredLog[index]} /> },
        position: { x: 600, y: loginCount * 205 + centerY },
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
      });
      loginCount++;
      initialEdges.push({
        type: "smoothstep",
        id: "e" + id + "-" + index.toString(),
        source: id || "",
        target: index.toString(),
        animated: true,
      });
    } else if (log.result === "signout") {
      const loginIndex = prevloginIndex;
      initialNodes.push({
        id: prevloginIndex + "-expand",
        data: {
          label: (
            <div
              className="w-full h-10 flex items-center justify-center"
              onClick={() => expand(loginIndex, index, true)}
            >
              <Handle
                className="h-3 w-3 border-[3px] bg-white border-gray-400"
                type="source"
                position={Position.Right}
              />
              <Handle
                className="h-3 w-3 border-[3px] bg-white border-gray-400"
                type="target"
                position={Position.Left}
              />
              <div>Expand</div>
            </div>
          ),
        },
        position: { x: 900, y: (loginCount - 1) * 205 + 12.5 + centerY },
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
      initialNodes.push({
        id: index.toString(),
        data: { label: <LogNode userLog={filteredLog[index]} /> },
        position: { x: 1100, y: (loginCount - 1) * 205 + centerY },
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
      });
      initialEdges.push({
        type: "smoothstep",
        id: "e-" + prevloginIndex + "-expand",
        source: prevloginIndex.toString(),
        target: prevloginIndex + "-expand",
        animated: true,
      });
      initialEdges.push({
        type: "smoothstep",
        id: "e" + prevloginIndex.toString() + "-" + index.toString(),
        source: prevloginIndex + "-expand",
        target: index.toString(),
        animated: true,
      });
    }
  });

  const expand = (
    loginIndex: number,
    signoutIndex: number,
    firstTime: boolean,
  ) => {
    const expandNodeIndex = initialNodes.findIndex(
      (item) => item.id === loginIndex + "-expand",
    );
    initialNodes.splice(expandNodeIndex, 1);

    const filteredSessionTime = filteredSession.filter(
      (item) =>
        new Date(item.createdTime) >
          new Date(filteredLog[loginIndex].createdTime) &&
        new Date(item.createdTime) <
          new Date(filteredLog[signoutIndex].createdTime),
    );

    // const expandEdgeIndex = edges.findIndex(
    //   (item) => item.id === "e-" + loginIndex + "-expand",
    // );

    // const edgeToDelete = edges.findIndex(
    //   (item) => item.source === loginIndex + "-expand",
    // );

    const loginNode = initialNodes.find(
      (item) => item.id == loginIndex.toString(),
    );
    filteredSessionTime.forEach((session, index) => {
      initialNodes.push({
        id: `session-${loginIndex}-${index}`,
        type: "custom",
        data: {
          label: (
            <SessionNode
              key={`session-${loginIndex}-${index}`}
              userSession={filteredSessionTime[index]}
            />
          ),
        },
        position: {
          x: loginNode!.position.x + (index + 1) * 300,
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
        },
      });
      setNodes(initialNodes);

      if (index === 0 && firstTime) {
        const newEdge = {
          id: `e-session-login[${loginIndex}]-${index}`,
          source: loginIndex.toString(),
          target: `session-${loginIndex}-${index}`,
          animated: true,
        };
        addEdge(newEdge);
      } else if (firstTime) {
        const newEdge = {
          id: `e-session-${loginIndex}-${index - 1}-${index}`,
          source: `session-${loginIndex}-${index - 1}`,
          target: `session-${loginIndex}-${index}`,
          animated: true,
        };
        addEdge(newEdge);
      }
      if (index === filteredSessionTime.length - 1) {
        const signoutNode = initialNodes.find(
          (item) => item.id == signoutIndex.toString(),
        );
        signoutNode!.position.x = loginNode!.position.x + (index + 2) * 300;
        if (firstTime) {
          const signoutEdge = {
            id: `e-session-${index}-${signoutIndex}`,
            source: `session-${loginIndex}-${index}`,
            target: signoutIndex.toString(),
            animated: true,
          };
          addEdge(signoutEdge);
        }
        // shrink node
        initialNodes.push({
          id: loginIndex + "-shrink",
          data: {
            label: (
              <div
                className="w-full h-10 flex items-center justify-center"
                onClick={() => shrink(loginIndex, signoutIndex, index)}
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
            x: signoutNode!.position.x + 300,
            y: signoutNode!.position.y + 10,
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
          },
        });
        setNodes(initialNodes);
        if (firstTime) {
          const shrinkEdge = {
            id: `e-${index}-shrink`,
            source: signoutIndex.toString(),
            target: `${loginIndex}-shrink`,
            animated: true,
          };
          addEdge(shrinkEdge);
        }
      }
    });
  };

  const shrink = (loginIndex: number, signoutIndex: number, index: number) => {
    const shrinkNodeIndex = initialNodes.findIndex(
      (item) => item.id === loginIndex + "-shrink",
    );
    //delete shrink node
    initialNodes.splice(shrinkNodeIndex, 1);
    //delete expanded nodes
    while (index >= 0) {
      initialNodes.splice(
        initialNodes.findIndex(
          (item) => item.id === `session-${loginIndex}-${index}`,
        ),
        1,
      );
      index--;
    }
    const signoutNodeIndex = initialNodes.findIndex(
      (item) => item.id === signoutIndex.toString(),
    );
    const loginNodeIndex = initialNodes.findIndex(
      (item) => item.id === loginIndex.toString(),
    );
    //push expand node
    initialNodes.push({
      id: loginIndex + "-expand",
      data: {
        label: (
          <div
            className="w-full h-10 flex items-center justify-center"
            onClick={() => expand(loginIndex, signoutIndex, false)}
          >
            <Handle
              className="h-3 w-3 border-[3px] bg-white border-gray-400"
              type="source"
              position={Position.Right}
            />
            <Handle
              className="h-3 w-3 border-[3px] bg-white border-gray-400"
              type="target"
              position={Position.Left}
            />
            <div>Expand</div>
          </div>
        ),
      },
      position: { x: 900, y: initialNodes[signoutNodeIndex].position.y + 10 },
      sourcePosition: "right",
      targetPosition: "left",
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
      },
    });
    //change signout node position to it's default
    initialNodes[signoutNodeIndex].position.x =
      initialNodes[loginNodeIndex].position.x + 500;
    setNodes(initialNodes);
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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

  useEffect(() => {
    if (location.state) {
      const sortLog = filteredLog.sort(
        (a, b) => new Date(a.createdTime) - new Date(b.createdTime),
      );
      const signoutIndex = sortLog.findIndex(
        (item) => item.createdTime > location.state.message,
      );
      const loginIndex = signoutIndex - 1;
      const filteredSessionTime = filteredSession.filter(
        (item) =>
          new Date(item.createdTime) >
            new Date(filteredLog[loginIndex].createdTime) &&
          new Date(item.createdTime) <
            new Date(filteredLog[signoutIndex].createdTime),
      );
      const sessionIndex = filteredSessionTime.findIndex(
        (item) => item.createdTime === location.state.message,
      );
      expand(loginIndex, signoutIndex, true);
      setNodes((nds) =>
        nds.map((node) =>
          node.id === `session-${loginIndex}-${sessionIndex}`
            ? { ...node, style: { ...node.style, backgroundColor: "red" } }
            : node,
        ),
      );
    }
  }, []);
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
}

export default UserFlow;
