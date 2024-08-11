import { useState, useEffect, useCallback } from "react";
import { Node } from "../types/node";
import { Edge } from "../types/edge";
import UserNode from "../components/UserNode";
import LogNode from "../components/LogNode";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import userLogs from "../assets/userLogs.json";
import userSession from "../assets/sessions.json";
import { Link } from "react-router-dom";
import Pagination from "../layouts/Pagination";
import { Log } from "../types/log";
import Filter from "../components/Filter";
import LogCount from "../components/LogCountNode";
import UserFlow from "./UserFlow";
import LogsPagination from "../components/LogsPagination";
import { createUserNode } from "../components/createUserNode";

userLogs.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
const visitedPageUser: number[] = [];
// const [visitedPages, setVisitedPages] = useState<number[]>([]);

function LogsFlow() {
  const addEdge = (newEdge: Edge) => {
    setEdges((prev) => [...prev, newEdge]);
  };
  const initialNodes: Node[] = [],
    initialEdges: Edge[] = [];
  const [startIndex, setStartIndex] = useState(0);
  const handleChangePage = (index: number) => {
    setStartIndex((index - 1) * 4);
  };

  const [logStartIndex, setLogStartIndex] = useState(0);

  const [selectedDates, setSelectedDates] = useState<Date[]>();
  const [filteredLog, setFilteredLog] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const search = (data: { user: string; selectedDates }) => {
    setSearchInput(data.user);
    setSelectedDates(data.selectedDates);
  };
  const [currentUser, setCurrentUser] = useState<string>("");

  //get all usernames
  const userNames: string[] = userLogs.reduce((acc, item) => {
    if (!acc.includes(item.userName)) {
      acc.push(item.userName);
    }
    return acc;
  }, []);

  const filteredUser: string[] = userNames.filter((user) =>
    user.toLowerCase().includes(searchInput),
  );

  //add users nodes
  useEffect(() => {
    initialNodes.splice(0, initialNodes.length);
    setNodes(initialNodes);
    filteredUser.forEach((user, index) => {
      if (index <= startIndex + 3 && index >= startIndex) {
        //add user nodes
        // initialNodes.push({
        //   id: user,
        //   data: {
        //     label: (
        //       <Link
        //         className="w-full h-full flex justify-center items-center"
        //         to={`../user/${user}`}
        //       >
        //         <UserNode userName={user} />
        //       </Link>
        //     ),
        //   },
        //   position: { x: 100, y: ((index % 4) + 1) * 150 - 20 },
        //   count: 0,
        //   type: "output",
        //   targetPosition: "right",
        //   style: {
        //     width: "200px",
        //     height: "60px",
        //     border: "2px solid gray",
        //     borderRadius: "6px",
        //     display: "flex",
        //     justifyContent: "center",
        //     alignItems: "center",
        //     fontSize: "16px",
        //     backgroundColor: "#f5f5f5",
        //   },
        // });
        initialNodes.push(createUserNode(user, index));
        const logCount = userLogs.filter((log) => log.userName === user).length;
        const sessionCount = userSession.filter(
          (session) => session.userName === user,
        ).length;
        initialNodes.push({
          id: user + "-logs",
          data: {
            label: (
              <div onClick={() => showLogs(user, ((index % 4) + 1) * 150 - 20)}>
                <LogCount logCount={logCount} sessionCount={sessionCount} />
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
        });
        if (!visitedPageUser.includes(user)) {
          addEdge({
            id: "e-" + user + "-logs",
            source: user,
            target: user + "-logs",
            animated: true,
          });
          visitedPageUser.push(user);
        }
      }
    });
    setNodes(initialNodes);
  }, [startIndex, searchInput, selectedDates, logStartIndex]);

  useEffect(() => {
    const index = filteredUser.findIndex((user) => user === currentUser);
    showLogs(currentUser, ((index % 4) + 1) * 150 - 20);
  }, [logStartIndex]);
  // const [isFirst, setIsFirst] = useState(true);
  let logNum = 0;
  const showLogs = (user, position) => {
    console.log(logNum);
    if (currentUser !== user) setLogStartIndex(0);
    setCurrentUser(user);
    const yPosition = position;
    if (logNum !== 0) {
      if (logNum > 3) logNum = 9;
      else logNum = logNum * 3;
      initialNodes.splice(
        initialNodes.length - logNum - 1,
        initialNodes.length - 1,
      );
      setNodes(initialNodes);
    }
    logNum = 0;
    // if (!isFirst) {
    //   initialNodes.splice(1, initialNodes.length);
    //   setNodes(initialNodes);
    // }
    // setIsFirst(false);
    let prevloginIndex = 0;
    let loginNumber = 0;
    let signoutNumber = 0;
    // if (selectedDates) {
    //   filtered = userLogs.filter(
    //     (log) =>
    //       new Date(log.createdTime).getTime() > selectedDates[0].$d.getTime() &&
    //       new Date(log.createdTime).getTime() < selectedDates[1].$d.getTime() &&
    //       log.userName === user,
    //   );
    //   setFilteredLog(filtered);
    // } else {
    const userFilterLog = userLogs.filter((log) => log.userName === user);
    setFilteredLog(userFilterLog);
    // }
    const handleLogPage = (index: number) => {
      setLogStartIndex((index - 1) * 3);
    };
    // add pagination node
    initialNodes.push({
      id: user + "-pagination",
      data: {
        label: (
          <div className="flex justify-center items-center">
            <LogsPagination
              onChangePage={handleLogPage}
              userNumber={userFilterLog.length / 2}
            />
          </div>
        ),
      },
      position: { x: 400, y: yPosition + 80 },
      style: {
        width: "150px",
        height: "20px",
        border: "none",
        shadow: "none",
      },
    });
    userFilterLog.forEach((log, index) => {
      let x: number = 0;
      if (userFilterLog.length >= 6) x = (index % 6) - 2;
      else if (userFilterLog.length == 4) x = index - 1;
      else if (userFilterLog.length == 2) x = index;
      if (log.result === "login") {
        loginNumber++;
        if (loginNumber > logStartIndex && loginNumber <= logStartIndex + 3) {
          logNum++;
          prevloginIndex = index;
          initialNodes.push({
            id: user + "-" + index.toString(),
            data: { label: <LogNode userLog={userFilterLog[index]} /> },
            position: { x: 650, y: yPosition + x * 120 },
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
          // if (!visitedPages.includes(index)) {
          addEdge({
            // type: "smoothstep",
            id: "e" + user + "-" + index.toString(),
            source: user + "-logs",
            target: user + "-" + index.toString(),
            animated: true,
          });
          // visitedPages.push(index);
          // }
        }
      } else if (log.result === "signout") {
        signoutNumber++;
        if (
          signoutNumber > logStartIndex &&
          signoutNumber <= logStartIndex + 3
        ) {
          // logNum++;
          const loginIndex = prevloginIndex;
          initialNodes.push({
            id: prevloginIndex + "-expand",
            data: {
              label: (
                <div
                  className="w-full h-10 flex items-center justify-center"
                  // onClick={() => expand(loginIndex, index, true)}
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
            position: { x: 900, y: yPosition + (x - 1) * 120 + 12.5 },
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
            id: user + "-" + index.toString(),
            data: { label: <LogNode userLog={userFilterLog[index]} /> },
            position: { x: 1050, y: yPosition + (x - 1) * 120 },
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
              transition: "all 1s ease",
            },
          });
          setNodes(initialNodes);
          // if (!visitedPages.includes(index)) {
          addEdge({
            id: "e-" + user + "-" + prevloginIndex + "-expand",
            source: user + "-" + prevloginIndex.toString(),
            target: prevloginIndex + "-expand",
            animated: true,
          });
          addEdge({
            id:
              "e" +
              user +
              "-" +
              prevloginIndex.toString() +
              "-" +
              index.toString(),
            source: prevloginIndex + "-expand",
            target: user + "-" + index.toString(),
            animated: true,
          });
          // visitedPages.push(index);
          // }
        }
      }
    });
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
    console.log(nodes);
  }, [nodes]);
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
        userNumber={filteredUser.length}
      />
      <Background color="grey" gap={16} />
      <Controls />
      <Filter search={search} />
    </ReactFlow>
  );
}

export default LogsFlow;
