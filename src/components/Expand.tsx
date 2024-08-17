import { Position, Handle } from "@xyflow/react";
import { CreateSessionNode } from "./CreateNode/CreateSessionNode";
import { Node } from "../types/node";
import { Session } from "../types/session";
import { Log } from "../types/log";

const Expand = (
  loginIndex: number,
  signoutIndex: number,
  firstTime: boolean,
  initialNodes: Node[],
  filteredSession: Session[],
  filteredLog: Log[],
  addEdge,
  setNodes,
  user: string,
  showLogs,
  showLogsIndex: number,
) => {
  const collapse = () => {
    showLogs(user, ((showLogsIndex % 4) + 1) * 150 - 20, true);
  };
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
  const loginNode = initialNodes.find(
    (item) => item.id == user + "-login-" + loginIndex,
  );
  filteredSessionTime.forEach((session, index) => {
    const sessionNodeId = `session-${loginIndex}-${index}`;
    //check if it is duplicate node
    if (!initialNodes.some((node) => node.id === sessionNodeId)) {
      //add session nodes
      initialNodes.push(
        CreateSessionNode(loginIndex, index, filteredSession, loginNode),
      );
      setNodes(initialNodes);
      setTimeout(() => {
        initialNodes[initialNodes.length - 1].position.x += 200;
        initialNodes[initialNodes.length - 1].style!.opacity = 1;
        initialNodes.find((item) => item.id === sessionNodeId)!.position.x +=
          100;
        setNodes(initialNodes);
      }, 10);
    }
    if (index === 0 && firstTime) {
      const newEdge = {
        id: `e-session-login[${loginIndex}]-${index}`,
        source: `${user}-login-${loginIndex}`,
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
        (item) => item.id == `${user}-signout-${loginIndex + 1}`,
      );
      signoutNode!.position.x = loginNode!.position.x + (index + 2) * 250;
      if (firstTime) {
        const signoutEdge = {
          id: `e-session-${index}-signout${loginIndex}`,
          source: `session-${loginIndex}-${index}`,
          target: signoutNode.id,
          animated: true,
        };
        addEdge(signoutEdge);
      }
      // collapse node
      initialNodes.push({
        id: loginIndex + "-collapse",
        data: {
          label: (
            <div
              className="w-full h-10 flex items-center justify-center"
              onClick={() => collapse(loginIndex, signoutIndex, index)}
            >
              <Handle
                className="h-3 w-3 border-[3px] bg-white border-gray-400"
                type="target"
                position={Position.Left}
              />
              <div>Collapse</div>
            </div>
          ),
        },
        position: {
          x: signoutNode!.position.x + 50 - index * 200,
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
          transition: "all 1s ease",
          opacity: 0,
        },
      });
      setNodes(initialNodes);
      if (firstTime) {
        const collapseEdge = {
          id: `e-${loginIndex}-collapse`,
          source: signoutNode.id,
          target: `${loginIndex}-collapse`,
          animated: true,
        };
        addEdge(collapseEdge);
      }
    }
  });
};

export default Expand;
