import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import userLogs from '../../assets/userLogs.json';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import UserNode from '../../components/UserNode';
import Node from '../../components/Node';

function UserFlow() {
const { id } = useParams();
const initialNodes = [], initialEdges = [];
userLogs.sort((a, b) => new Date(a.createdTime) - new Date(b.createdTime));
const windowHeight = window.innerHeight;
const centerY = windowHeight / 2;
initialNodes.push({
    id: id,
    data: {label: <UserNode userName={id} />}, 
    position: {x: 100, y: centerY},
    type: "output",
    targetPosition: "right",
    style: {
      width: "200px",
      height: "70px",
      border: "2px solid gray",
      borderRadius: "6px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "16px"
    }
  });

const filteredLog = userLogs.filter(item => item.userName === id);
let loginCount = -1 * (userLogs.filter(item => item.result === "login").length - 1) / 2 , prevloginIndex = 0;
console.log(loginCount)
filteredLog.forEach((log, index) => {
    console.log(loginCount)
    if(log.result === "login") {
        prevloginIndex = index;
        initialNodes.push({
            id: index.toString(),
            data: {label: <Node userLog={filteredLog[index]}/>},
            position: {x: 600, y: loginCount * 205 + centerY},
            sourcePosition: "right",
            targetPosition: "left",
            style: {
                width: "200px",
                height: "70px",
                fontSize: "13px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                border: "2px solid #cc33ff",
                borderRadius: "6px",
                visibility: "visible"
            }
        })
        loginCount++;
        initialEdges.push({
            id: "e"+id+index.toString(),
            source: id,
            target: index.toString(),
            animated: true
        })
    }
    else if(log.result === "signout") {
        initialNodes.push({
            id: index.toString(),
            data: {label: <Node userLog={filteredLog[index]}/>},
            position: {x: 1100, y: (loginCount-1) * 205 + centerY},
            sourcePosition: "right",
            targetPosition: "left",
            style: {
                width: "200px",
                height: "70px",
                fontSize: "13px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                border: "2px solid #cc33ff",
                borderRadius: "6px",
                visibility: "visible"
            }
        })
        initialEdges.push({
            id: "e"+prevloginIndex.toString()+index.toString(),
            source: prevloginIndex.toString(),
            target: index.toString(),
            animated: true
        })
    }
})
const [nodes, setNodes] = useState(initialNodes);
const [edges, setEdges] = useState(initialEdges);
  return (
      <ReactFlow
        nodes={nodes}
        edges={edges}
      />
  );
}

export default UserFlow;