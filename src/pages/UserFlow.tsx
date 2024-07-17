import { ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import userLogs from '../assets/userLogs.json';
import userSession from '../assets/sessions.json';
import { useParams } from 'react-router-dom';
import { useEffect, useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import UserNode from '../components/UserNode';
import LogNode from '../components/LogNode';

function UserFlow() {
const { id } = useParams();
const initialNodes = [], initialEdges = [];
userLogs.sort((a, b) => new Date(a.createdTime) - new Date(b.createdTime));
userSession.sort((a, b) => new Date(a.createdTime) - new Date(b.createdTime));
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
    },
  });

const filteredLog = userLogs.filter(item => item.userName === id);
let loginCount = -1 * (filteredLog.filter(item => item.result === "login").length - 1) / 2 , prevloginIndex = 0;

const expand = (loginIndex: number, signoutIndex: number) => {
    const expandNodeIndex = initialNodes.findIndex(item => item.id === loginIndex+"-expand");
    initialNodes.splice(expandNodeIndex, 1);
    setNodes(initialNodes);
}

filteredLog.forEach((log, index) => {
    if(log.result === "login") {
        prevloginIndex = index;
        initialNodes.push({
            id: index.toString(),
            data: {label: <LogNode userLog={filteredLog[index]}/>},
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
            type: "smoothstep",
            id: "e"+id+"-"+index.toString(),
            source: id,
            target: index.toString(),
            animated: true
        })
    }
    else if(log.result === "signout") {
        const loginIndex = prevloginIndex;
        initialNodes.push({
            id: prevloginIndex+"-expand",
            data: {label: 
                <div onClick={() => expand(loginIndex, index)}>
                    <Handle
                    className="h-4 w-4 border-4 bg-white border-gray-400"
                    type="source"
                    position={Position.Right}
                    />
                    <Handle
                    className="h-4 w-4 border-4 bg-white border-gray-400"
                    type="target"
                    position={Position.Left}
                    />
                    <div>Expand</div>
                </div>
            },
            position: {x: 900, y: (loginCount-1) * 205 + 15 + centerY},
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
                visibility: "visible"
            } 
        })
        initialNodes.push({
            id: index.toString(),
            data: {label: <LogNode userLog={filteredLog[index]}/>},
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
        });
        initialEdges.push({
            id: "e-" + prevloginIndex + "-expand",
            source: prevloginIndex.toString(),
            target: prevloginIndex + "-expand",
            animated: true
        })
        initialEdges.push({
            id: "e"+prevloginIndex.toString() + "-" +index.toString(),
            source: prevloginIndex + "-expand",
            target: index.toString(),
            animated: true
        })
        console.log(initialEdges)
    }
})
const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
console.log(nodes)

const onNodesDelete = useCallback((deleted) => {
    setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge),
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
    [nodes, edges],
);
  return (
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesDelete={onNodesDelete}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
  );
}

export default UserFlow;