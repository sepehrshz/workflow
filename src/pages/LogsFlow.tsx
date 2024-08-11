import { useState, useEffect } from "react";
import { Node } from "../types/node";
import { Edge } from "../types/edge";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import userLogs from "../assets/userLogs.json";
import userSession from "../assets/sessions.json";
import Pagination from "../layouts/Pagination";
import Filter from "../components/Filter";
import { CreateUserNode } from "../components/CreateUserNode";
import { CreateUserStatsNode } from "../components/CreateUserStatsNode";
import { CreateLogPaginationNode } from "../components/CreateLogPaginationNode";
import { CreateLoginNode } from "../components/CreateLoginNode";
import { CreateExpandNode } from "../components/CreateExpandNode";
import { CreateSignoutNode } from "../components/CreateSignoutNode";
import { onNodesDelete } from "../components/onNodesDelete";

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

  //add users and stats nodes
  useEffect(() => {
    initialNodes.splice(0, initialNodes.length);
    setNodes(initialNodes);
    filteredUser.forEach((user, index) => {
      if (index <= startIndex + 3 && index >= startIndex) {
        //add user nodes
        initialNodes.push(CreateUserNode(user, index));

        //find number of user logs and sessions
        const logCount = userLogs.filter((log) => log.userName === user).length;
        const sessionCount = userSession.filter(
          (session) => session.userName === user,
        ).length;

        //add user statistics node
        initialNodes.push(
          CreateUserStatsNode(user, index, logCount, sessionCount, showLogs),
        );

        //check to not add duplicate edges
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

  //handle showing logs in other page
  useEffect(() => {
    const index = filteredUser.findIndex((user) => user === currentUser);
    showLogs(currentUser, ((index % 4) + 1) * 150 - 20);
  }, [logStartIndex]);

  // const [isFirst, setIsFirst] = useState(true);
  //show logs when click
  let loginNodeCount = 0;
  const showLogs = (user: string, position: number) => {
    if (currentUser !== user) setLogStartIndex(0);
    setCurrentUser(user);
    const yPosition = position;

    //delete previous user log nodes
    if (loginNodeCount !== 0) {
      if (loginNodeCount > 3)
        initialNodes.splice(initialNodes.length - 10, initialNodes.length);
      else
        initialNodes.splice(
          initialNodes.length - loginNodeCount * 3 - 1,
          initialNodes.length - 1,
        );
      setNodes(initialNodes);
      loginNodeCount = 0;
    }

    let prevloginIndex = 0;
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
    // }
    const handleLogPage = (index: number) => {
      setLogStartIndex((index - 1) * 3);
    };

    // add logs pagination node
    initialNodes.push(
      CreateLogPaginationNode(
        user,
        handleLogPage,
        userFilterLog.length,
        yPosition,
      ),
    );

    //add login, expand and signout nodes
    userFilterLog.forEach((log, index) => {
      let x = 0;
      if (userFilterLog.length >= 6) x = (index % 6) - 2;
      else if (userFilterLog.length == 4) x = index - 1;
      else if (userFilterLog.length == 2) x = index;

      if (log.result === "login") {
        loginNodeCount++;
        if (
          loginNodeCount > logStartIndex &&
          loginNodeCount <= logStartIndex + 3
        ) {
          prevloginIndex = index;

          //add login node
          initialNodes.push(
            CreateLoginNode(user, userFilterLog, index, x, yPosition),
          );

          // if (!visitedPages.includes(index)) {
          addEdge({
            id: "e" + user + "-" + index.toString(),
            source: user + "-logs",
            target: user + "-" + index.toString(),
            animated: true,
          });
          // visitedPages.push(index);
          // }
        }
      } else if (log.result === "signout") {
        if (
          loginNodeCount > logStartIndex &&
          loginNodeCount <= logStartIndex + 3
        ) {
          const loginIndex = prevloginIndex;

          //add expand node
          initialNodes.push(CreateExpandNode(prevloginIndex, yPosition, x));

          //add signout node
          initialNodes.push(
            CreateSignoutNode(user, index, yPosition, x, userFilterLog),
          );

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
