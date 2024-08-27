import { useState, useEffect, useRef } from "react";
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
import LogsPagination from "../components/LogsPagination";

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

  // const initialNodes: Node[] = [];
  const initialNodes = useRef<Node[]>([]);
  const initialEdges: Edge[] = [];

  const [startIndex, setStartIndex] = useState(0);

  // let currentPageLoginNode = 0;
  // const [currentPageLoginNode, setCurrentPageLoginNode] = useState(0);
  const currentPageLoginNode = useRef(0);

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

  const currentUser = useRef("");

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
    initialNodes.current.splice(0, initialNodes.current.length);
    setNodes(initialNodes.current);
    filteredUser.forEach((user, index) => {
      if (index <= startIndex + 3 && index >= startIndex) {
        //add user nodes
        initialNodes.current.push(CreateUserNode(user, index));

        //find number of user logs and sessions
        const logCount = userLogs.filter((log) => log.userName === user).length;
        const sessionCount = userSession.filter(
          (session) => session.userName === user,
        ).length;

        //add user statistics node
        initialNodes.current.push(
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
    setNodes(initialNodes.current);
  }, [startIndex, searchInput, selectedDates]);

  //handle showing logs in other page
  useEffect(() => {
    const index = filteredUser.findIndex(
      (user) => user === currentUser.current,
    );
    console.log(currentPageLoginNode.current);
    if (currentPageLoginNode.current !== 0) {
      if (currentPageLoginNode.current > 3)
        initialNodes.current.splice(
          initialNodes.current.length - 10,
          initialNodes.current.length - 1,
        );
      else
        initialNodes.current.splice(
          initialNodes.current.length - currentPageLoginNode.current * 3,
          initialNodes.current.length - 1,
        );
    }
    // setCurrentPageLoginNode(0);
    currentPageLoginNode.current = 0;
    setNodes(initialNodes.current.slice(0, 8));
    showLogs(currentUser.current, ((index % 4) + 1) * 150 - 20, true);
  }, [
    logStartIndex,
    selectedDates,
    currentUser,
    initialNodes,
    currentPageLoginNode,
  ]);

  //show logs when click
  let loginNodeCount = 0;
  const showLogs = (
    user: string,
    position: number,
    open: boolean,
    showLogsIndex?: number,
  ) => {
    //delete previous user logs nodes
    if (currentUser.current !== user && currentUser.current !== "") {
      setLogStartIndex(0);
      if (loginNodeCount !== 0) {
        if (loginNodeCount > 3)
          initialNodes.current.splice(
            initialNodes.current.length - 10,
            initialNodes.current.length - 1,
          );
        else
          initialNodes.current.splice(
            initialNodes.current.length - 1 - loginNodeCount * 3,
            initialNodes.current.length - 1,
          );
        setNodes(initialNodes.current);
        setEdges((prev) => prev.slice(0, 4));
      }
      loginNodeCount = 0;
      currentUser.current = user;
      // setCurrentPageLoginNode(0);
      currentPageLoginNode.current = 0;
    }
    //show user logs
    if (open) {
      currentUser.current = user;
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
      initialNodes.current.push(
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
            // setCurrentPageLoginNode((prev) => prev + 1);
            currentPageLoginNode.current = currentPageLoginNode.current + 1;
            prevloginIndex = index;

            //add login node
            initialNodes.current.push(
              CreateLoginNode(user, userFilterLog, index, x, yPosition),
            );

            addEdge({
              id: "e-" + user + "-login-" + index,
              source: user + "-stats",
              target: user + "-login-" + index,
              animated: true,
            });
            setNodes(initialNodes.current);
          }
        } else if (log.result === "signout") {
          if (
            loginNodeCount > logStartIndex &&
            loginNodeCount <= logStartIndex + 3
          ) {
            const loginIndex = prevloginIndex;
            //add expand node
            initialNodes.current.push(
              CreateExpandNode(
                prevloginIndex,
                yPosition,
                x,
                loginIndex,
                index,
                initialNodes.current,
                filteredSession,
                userFilterLog,
                addEdge,
                setNodes,
                user,
                showLogs,
                showLogsIndex,
                setEdges,
              ),
            );

            //add signout node
            initialNodes.current.push(
              CreateSignoutNode(user, index, yPosition, x, userFilterLog),
            );
            setNodes(initialNodes.current);

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
    }
    //hide user logs
    else if (!open) {
      console.log(currentPageLoginNode.current);
      if (loginNodeCount !== 0) {
        if (currentPageLoginNode.current === 3)
          initialNodes.current.splice(
            initialNodes.current.length - 10,
            initialNodes.current.length - 1,
          );
        else if (currentPageLoginNode.current === 2)
          initialNodes.current.splice(
            initialNodes.current.length - 8,
            initialNodes.current.length - 1,
          );
        else {
          initialNodes.current.splice(
            initialNodes.current.length - 4,
            initialNodes.current.length - 1,
          );
        }
        setNodes(initialNodes.current);
        setEdges((prev) => prev.slice(0, 4));
        loginNodeCount = 0;
      }
    }
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes.current);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    console.log(nodes);
  }, [nodes]);

  useEffect(() => {
    initialNodes.current.pop();
    setNodes(initialNodes.current);
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
