import { useState, useEffect } from "react";
import { Node } from "../types/node";
import { Edge } from "../types/edge";
import UserNode from "../components/UserNode";
import LogNode from "../components/LogNode";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import userLogs from "../assets/userLogs.json";
import { Link } from "react-router-dom";
import Pagination from "../layouts/Pagination";
import { Log } from "../types/log";
import Filter from "../components/Filter";

userLogs.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
const visitedPageUser: number[] = [];

function LogsFlow() {
  const addEdge = (newEdge: Edge) => {
    setEdges((prev) => [...prev, newEdge]);
  };
  const initialNodes: Node[] = [],
    initialEdges: Edge[] = [];
  const selectedLogs: Log[] = [];
  const [startIndex, setStartIndex] = useState(0);
  const handleChangePage = (index: number) => {
    setStartIndex((index - 1) * 4);
  };

  const [searchInput, setSearchInput] = useState("");
  const search = (data: { user: string; selectedDates }) => {
    console.log(data.user);
    setSearchInput(data.user);
  };

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

  //add nodes base on startIndex
  useEffect(() => {
    initialNodes.splice(0, initialNodes.length);
    setNodes(initialNodes);
    filteredUser.forEach((user, index) => {
      if (index <= startIndex + 3 && index >= startIndex) {
        const lastLogin = userLogs.find(
          (log) => log.result === "login" && log.userName === user,
        );
        const lastLogout = userLogs.find(
          (log) => log.result === "signout" && log.userName === user,
        );
        //add user nodes
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
          position: { x: 330, y: ((index % 4) + 1) * 150 - 20 },
          count: 0,
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
        if (
          !selectedLogs.some(
            (log) =>
              log.createdTime === lastLogin?.createdTime ||
              log.createdTime === lastLogout?.createdTime,
          )
        ) {
          selectedLogs.push(lastLogin, lastLogout);
        }
        if (!visitedPageUser.includes(user)) {
          console.log(visitedPageUser);
          addEdge({
            id: user + "1",
            source: user,
            target: user + "1",
            animated: true,
          });
          visitedPageUser.push(user);
          addEdge({
            id: user + "1-2",
            source: user + "1",
            target: user + "2",
            animated: true,
          });
        }
      }
    });
    setNodes(initialNodes);

    //add logs node
    selectedLogs.forEach((log, index) => {
      const user = initialNodes.find((item) => item.id == log.userName);
      user.count++;
      const positionY = user.position.y;
      initialNodes.push({
        id: user.id + user.count,
        type: "default",
        data: { label: <LogNode userLog={selectedLogs[index]} /> },
        position: { y: positionY, x: (user.count + 1) * 330 },
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
      setNodes(initialNodes);
    });
  }, [startIndex, searchInput]);

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  return (
    <ReactFlow nodes={nodes} edges={edges}>
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
