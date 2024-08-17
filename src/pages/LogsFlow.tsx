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
import { CreateUserNode } from "../components/CreateNode/CreateUserNode";
import { CreateUserStatsNode } from "../components/CreateNode/CreateUserStatsNode";
import { CreateLogPaginationNode } from "../components/CreateNode/CreateLogPaginationNode";
import { CreateLoginNode } from "../components/CreateNode/CreateLoginNode";
import { CreateExpandNode } from "../components/CreateNode/CreateExpandNode";
import { CreateSignoutNode } from "../components/CreateNode/CreateSignoutNode";
import { onNodesDelete } from "../components/onNodesDelete";

userLogs.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
userSession.sort(
  (a, b) =>
    new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime(),
);

const visitedPage: string[] = [];
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
  let currentUser = "";

  const [isDone, setIsDone] = useState(false);
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

        if (!visitedPage.includes(user)) {
          addEdge({
            id: "e-" + user + "-stats",
            source: user,
            target: user + "-stats",
            animated: true,
          });
          visitedPage.push(user);
        }
      }
    });
    setNodes(initialNodes);
    setIsDone(true);
  }, [startIndex, searchInput, selectedDates, logStartIndex]);

  //handle showing logs in other page
  useEffect(() => {
    console.log(isDone);
    const index = filteredUser.findIndex((user) => user === currentUser);
    showLogs(currentUser, ((index % 4) + 1) * 150 - 20, true);
  }, [logStartIndex, selectedDates, isDone]);

  //show logs when click
  let loginNodeCount = 0;
  const showLogs = (
    user: string,
    position: number,
    open: boolean,
    showLogsIndex?: number,
  ) => {
    if (currentUser !== user && currentUser !== "") {
      setLogStartIndex(0);
      if (loginNodeCount !== 0) {
        if (loginNodeCount > 3)
          initialNodes.splice(
            initialNodes.length - 10,
            initialNodes.length - 1,
          );
        else
          initialNodes.splice(
            initialNodes.length - 1 - loginNodeCount * 3,
            initialNodes.length - 1,
          );
        setNodes(initialNodes);
        setEdges((prev) => prev.slice(0, 4));
      }
      currentUser = user;
      loginNodeCount = 0;
    }
    if (open) {
      currentUser = user;

      const yPosition = position;

      const filteredSession = userSession.filter(
        (item) => item.userName === user,
      );

      if (loginNodeCount !== 0) {
        loginNodeCount = 0;
      }

      let prevloginIndex = 0;
      let userFilterLog;

      if (selectedDates) {
        userFilterLog = userLogs.filter(
          (log) =>
            new Date(log.createdTime).getTime() >
              selectedDates[0].$d.getTime() &&
            new Date(log.createdTime).getTime() <
              selectedDates[1].$d.getTime() &&
            log.userName === user,
        );
      } else {
        userFilterLog = userLogs.filter((log) => log.userName === user);
      }

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

            addEdge({
              id: "e-" + user + "-login-" + index,
              source: user + "-stats",
              target: user + "-login-" + index,
              animated: true,
            });
          }
        } else if (log.result === "signout") {
          if (
            loginNodeCount > logStartIndex &&
            loginNodeCount <= logStartIndex + 3
          ) {
            const loginIndex = prevloginIndex;
            //add expand node
            initialNodes.push(
              CreateExpandNode(
                prevloginIndex,
                yPosition,
                x,
                loginIndex,
                index,
                initialNodes,
                filteredSession,
                userFilterLog,
                addEdge,
                setNodes,
                user,
                showLogs,
                showLogsIndex,
              ),
            );

            //add signout node
            initialNodes.push(
              CreateSignoutNode(user, index, yPosition, x, userFilterLog),
            );

            setNodes(initialNodes);
            addEdge({
              id: "e-" + user + "-" + prevloginIndex + "-expand",
              source: user + "-login-" + prevloginIndex,
              target: prevloginIndex + "-expand",
              animated: true,
            });
            addEdge({
              id: "e-" + user + "-signout-" + index,
              source: prevloginIndex + "-expand",
              target: user + "-signout-" + index,
              animated: true,
            });
          }
        }
      });
    } else {
      if (loginNodeCount !== 0) {
        if (loginNodeCount > 3)
          initialNodes.splice(
            initialNodes.length - 10,
            initialNodes.length - 1,
          );
        else
          initialNodes.splice(
            initialNodes.length - 1 - loginNodeCount * 3,
            initialNodes.length - 1,
          );
        setNodes(initialNodes);
        setEdges((prev) => prev.slice(0, 4));
        loginNodeCount = 0;
      }
    }
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  useEffect(() => {
    console.log(edges);
  }, [edges]);

  useEffect(() => {
    initialNodes.pop();
    setNodes(initialNodes);
  }, []);

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
