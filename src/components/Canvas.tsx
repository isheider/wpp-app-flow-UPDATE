import { useCallback, useRef, useState } from "react";
import * as Toolbar from "@radix-ui/react-toolbar";
import { Square as SquareIcon } from "phosphor-react";
import { zinc, sky, blue } from "tailwindcss/colors";
import * as ContextMenu from "@radix-ui/react-context-menu";
import ReactFlow, {
  Controls,
  Background,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  ConnectionMode,
  ConnectionLineType,
  EdgeMarkerType,
  MarkerType,
  Connection,
} from "reactflow";

import "reactflow/dist/style.css";
import "@reactflow/node-resizer/dist/style.css";
import { Square } from "./Square";
import CompareTextNode from "./CompareTextNode";
import MessageNode from "./MessageNode";
import ImageNode from "./Nodes/SendImageNode";
import VideoNode from "./Nodes/SendVideoNode";
import AudioNode from "./Nodes/SendAudioNode";
import DocumentNode from "./Nodes/SendDocumentNode";
import SetVariableNode from "./Nodes/SetVariableNode";
import DelayNode from "./Nodes/DelayNode";
import StartNode from "./Nodes/StartNode";
import CaptureTextNode from "./Nodes/CaptureTextNode";
import { DefaultEdge } from "./DefaultEdge";
import Aside from "./Aside";

interface InitialNode extends Node {
  type: keyof typeof NODE_TYPES;
}

const initialNodes: InitialNode[] = [
  {
    id: "1",
    position: { x: 200, y: 400 },
    data: {},
    type: "startNode",
  },

  {
    id: "2",
    position: { x: 800, y: 400 },

    data: { onChange: () => {}, color: "#ffffff" },
    type: "selector",
  },
];

const initialEdges: Edge[] = [
  // {
  //   id: 'e1-2',
  //   source: '1',
  //   target: '2',
  //   label: 'connect to'
  // }
];

const NODE_TYPES = {
  square: Square,
  selector: CompareTextNode,
  messageNode: MessageNode,
  imageNode: ImageNode,
  videoNode: VideoNode,
  audioNode: AudioNode,
  delayNode: DelayNode,
  captureTextNode: CaptureTextNode,
  setVariableNode: SetVariableNode,
  documentNode: DocumentNode,
  startNode: StartNode,
};

const EDGE_TYPES = {
  default: DefaultEdge,
};

export function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const reactFlowWrapper = useRef<any>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const onConnect = useCallback(
    (params: Connection) => {
      return setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const handleAddNode = useCallback((type: any) => {
    setNodes((nodes) => {
      return [
        ...nodes,
        {
          id: crypto.randomUUID(),
          position: {
            x: 750,
            y: 350,
          },
          data: {},
          type: "square",
        },
      ];
    });
  }, []);

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      if (!reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: String(Date.now()),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  return (
    <>
      <ReactFlowProvider>
        <ContextMenu.Root>
          <div className="reactflow-wrapper h-full" ref={reactFlowWrapper}>
            <ReactFlow
              nodeTypes={NODE_TYPES}
              edgeTypes={EDGE_TYPES}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              maxZoom={10}
              onConnect={onConnect}
              connectionMode={ConnectionMode.Strict}
              connectionLineType={ConnectionLineType.Step}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
              fitViewOptions={{
                padding: 50,
              }}
              connectionLineStyle={{
                stroke: blue["400"],
                strokeWidth: 3,
                strokeDashoffset: 5,
                strokeDasharray: 5,
              }}
              defaultEdgeOptions={{
                type: "default",
                style: {
                  strokeWidth: 3,
                },
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  width: 20,
                  height: 20,
                  color: zinc["500"],
                },
              }}
            >
              <Controls />
              <Background gap={12} size={2} color={zinc["200"]} />
            </ReactFlow>

            <Aside />
          </div>
        </ContextMenu.Root>
      </ReactFlowProvider>
    </>
  );
}
