import { Position, Handle } from "@xyflow/react";
import { CreateSessionNode } from "./CreateNode/CreateSessionNode";

const Expand = (
  loginIndex: number,
  signoutIndex: number,
  firstTime: boolean,
  initialNodes,
  filteredSession,
  filteredLog,
  addEdge,
  setNodes,
  user: string,
  userSession,
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
  const loginNode = initialNodes.find(
    (item) => item.id == user + "-" + loginIndex,
  );
  filteredSessionTime.forEach((session, index) => {
    const sessionNodeId = `session-${loginIndex}-${index}`;
    //check if it is duplicate node
    if (!initialNodes.some((node) => node.id === sessionNodeId)) {
      //add session nodes
      initialNodes.push(
        CreateSessionNode(loginIndex, index, userSession, loginNode),
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
      signoutNode!.position.x = loginNode!.position.x + (index + 2) * 250;
      if (firstTime) {
        const signoutEdge = {
          id: `e-session-${index}-signout${loginIndex}`,
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
              //   onClick={() => shrink(loginIndex, signoutIndex, index)}
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
        const shrinkEdge = {
          id: `e-${loginIndex}-shrink`,
          source: signoutIndex.toString(),
          target: `${loginIndex}-shrink`,
          animated: true,
        };
        addEdge(shrinkEdge);
      }
    }
  });
};

export default Expand;
