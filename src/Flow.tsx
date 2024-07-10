import { useState } from 'react';
import Node from './Node';
import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import userLogs from './userLogs.json';

function Flow() {
const windowHeight = window.innerHeight;
const centerX = windowHeight / 2;
const initialNodes = [], initialEdges = [];
userLogs.forEach((log, index) => {
    initialNodes.push({
        id: `${index}`, 
        data: {label: <Node userLog={userLogs[index]} />}, 
        position: { y: centerX, x: (index+1) * 300},
        style: {
            border: "1px solid grey"
        }
    });
    if(index !== userLogs.length) {
        initialEdges.push({
            id: `e${index}-${index+1}`,
            source: `${index}`,
            target: `${index+1}`,
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

export default Flow;
