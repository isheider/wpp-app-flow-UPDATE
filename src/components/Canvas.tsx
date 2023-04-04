// @ts-nocheck

import { useCallback, useRef, useEffect, useState } from "react";
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

import { NodeDataProvider, useNodeData } from "../contexts/NodeDataContext";

import "reactflow/dist/style.css";
import "@reactflow/node-resizer/dist/style.css";
import { Square } from "./Square";
import CompareTextNode from "./CompareTextNode";
import MessageNode from "./MessageNode";
import NavBar from "./NavBar";
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
import axios from "axios";

interface InitialNode extends Node {
  type: keyof typeof NODE_TYPES;
}

const initialNodes: InitialNode[] = [
  {
    id: "1",
    position: { x: 200, y: 400 },
    data: {},
    type: "selector",
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

  const { nodeData, setNodeData } = useNodeData();

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

  useEffect(() => {
    async function load() {
      const { data } = await axios.get(
        `https://3333-isaquecastr-wppappbacke-4b3wz0fz0lg.ws-us93.gitpod.io/templates/64268b4b76ea4d5e4f2b2e2c`
      );

      if (data) {
        setNodeData(data.flowData.nodeData);
        setNodes(data.flowData.nodes);
        setEdges(data.flowData.edges);
      }
    }
    load();
    // setNodeData({
    //   "1": {
    //     ways: [
    //       {
    //         id: "1680558458680",
    //         term: "Instagram",
    //         type: "contain",
    //       },
    //       {
    //         id: "1680558631864",
    //         term: "Pinterest",
    //         type: "contain",
    //       },
    //       {
    //         id: "1680558635217",
    //         term: "Facebook",
    //         type: "contain",
    //       },
    //     ],
    //     use_ways: true,
    //     node: {
    //       id: "1",
    //       data: {},
    //       type: "startNode",
    //       xPos: 200,
    //       yPos: 400,
    //       selected: false,
    //       sourcePosition: "bottom",
    //       targetPosition: "top",
    //       dragging: false,
    //       zIndex: 0,
    //     },
    //   },
    //   "2": {
    //     ways: [
    //       {
    //         id: "1680558423299",
    //         term: "sim",
    //         type: "contain",
    //       },
    //       {
    //         id: "1680558723055",
    //         term: "não",
    //         type: "contain",
    //       },
    //     ],
    //     content_data: {
    //       variable: "maior_de_idade",
    //     },
    //     use_ways: true,
    //     node: {
    //       id: "2",
    //       data: {
    //         color: "#ffffff",
    //       },
    //       type: "selector",
    //       xPos: 2284.3944944430395,
    //       yPos: 783.3126190026361,
    //       selected: true,
    //       sourcePosition: "bottom",
    //       targetPosition: "top",
    //       dragging: false,
    //       zIndex: 1000,
    //     },
    //     selectedVariable: {
    //       label: "maior_de_idade",
    //       value: "maior_de_idade",
    //     },
    //   },
    //   "1680558646873": {
    //     content: "Olá, seja bem vindo!",
    //   },
    //   "1680558663377": {
    //     selectedVariable: {
    //       label: "Nome",
    //       value: "nome",
    //     },
    //     content: "Qual é o seu nome?",
    //   },
    //   "1680558678215": {
    //     content: "Prazer %Nome%, você é maior de idade?",
    //   },
    //   "1680558692807": {
    //     selectedVariable: {
    //       label: "maior_de_idade",
    //       value: "maior_de_idade",
    //     },
    //     content: "Prazer %Nome%, você é maior de idade?",
    //   },
    //   "1680558729697": {
    //     content: "Sinto muito %Nome%, não aceitamos menores de idade aqui.",
    //   },
    //   "1680558728593": {
    //     content: "Bem vindo, %Nome%, Chat encerrado!",
    //   },
    // });
    // setNodes([
    //   {
    //     id: "1",
    //     position: {
    //       x: 214,
    //       y: 376,
    //     },
    //     data: {},
    //     type: "startNode",
    //     width: 384,
    //     height: 894,
    //     selected: true,
    //     positionAbsolute: {
    //       x: 214,
    //       y: 376,
    //     },
    //     dragging: false,
    //   },
    //   {
    //     id: "2",
    //     position: {
    //       x: 2284.3944944430395,
    //       y: 783.3126190026361,
    //     },
    //     data: {
    //       color: "#ffffff",
    //     },
    //     type: "selector",
    //     width: 384,
    //     height: 804,
    //     selected: false,
    //     positionAbsolute: {
    //       x: 2284.3944944430395,
    //       y: 783.3126190026361,
    //     },
    //     dragging: false,
    //   },
    //   {
    //     id: "1680558646873",
    //     type: "messageNode",
    //     position: {
    //       x: 755.2589480546238,
    //       y: 789.893626102104,
    //     },
    //     data: {
    //       label: "messageNode node",
    //     },
    //     width: 384,
    //     height: 260,
    //     selected: false,
    //     positionAbsolute: {
    //       x: 755.2589480546238,
    //       y: 789.893626102104,
    //     },
    //     dragging: false,
    //   },
    //   {
    //     id: "1680558663377",
    //     type: "captureTextNode",
    //     position: {
    //       x: 1292.9897285633194,
    //       y: 870.0492094881442,
    //     },
    //     data: {
    //       label: "captureTextNode node",
    //     },
    //     width: 384,
    //     height: 365,
    //     selected: false,
    //     positionAbsolute: {
    //       x: 1292.9897285633194,
    //       y: 870.0492094881442,
    //     },
    //     dragging: false,
    //   },
    //   {
    //     id: "1680558692807",
    //     type: "captureTextNode",
    //     position: {
    //       x: 1757.7528761709161,
    //       y: 919.8888835568795,
    //     },
    //     data: {
    //       label: "captureTextNode node",
    //     },
    //     width: 384,
    //     height: 365,
    //     selected: false,
    //     positionAbsolute: {
    //       x: 1757.7528761709161,
    //       y: 919.8888835568795,
    //     },
    //     dragging: false,
    //   },
    //   {
    //     id: "1680558728593",
    //     type: "messageNode",
    //     position: {
    //       x: 2822.9176938710266,
    //       y: 1016.2823432168725,
    //     },
    //     data: {
    //       label: "messageNode node",
    //     },
    //     width: 384,
    //     height: 260,
    //     selected: false,
    //     positionAbsolute: {
    //       x: 2822.9176938710266,
    //       y: 1016.2823432168725,
    //     },
    //     dragging: false,
    //   },
    //   {
    //     id: "1680558729697",
    //     type: "messageNode",
    //     position: {
    //       x: 2945.690735758369,
    //       y: 1407.3372173765551,
    //     },
    //     data: {
    //       label: "messageNode node",
    //     },
    //     width: 384,
    //     height: 260,
    //     selected: false,
    //     positionAbsolute: {
    //       x: 2945.690735758369,
    //       y: 1407.3372173765551,
    //     },
    //     dragging: false,
    //   },
    // ]);

    // setEdges([
    //   {
    //     type: "default",
    //     style: {
    //       strokeWidth: 3,
    //     },
    //     markerEnd: {
    //       type: "arrowclosed",
    //       width: 20,
    //       height: 20,
    //       color: "#71717a",
    //     },
    //     source: "1",
    //     sourceHandle: "1680558458680",
    //     target: "1680558646873",
    //     targetHandle: "top",
    //     id: "reactflow__edge-11680558458680-1680558646873top",
    //   },
    //   {
    //     type: "default",
    //     style: {
    //       strokeWidth: 3,
    //     },
    //     markerEnd: {
    //       type: "arrowclosed",
    //       width: 20,
    //       height: 20,
    //       color: "#71717a",
    //     },
    //     source: "1",
    //     sourceHandle: "1680558631864",
    //     target: "1680558646873",
    //     targetHandle: "top",
    //     id: "reactflow__edge-11680558631864-1680558646873top",
    //   },
    //   {
    //     type: "default",
    //     style: {
    //       strokeWidth: 3,
    //     },
    //     markerEnd: {
    //       type: "arrowclosed",
    //       width: 20,
    //       height: 20,
    //       color: "#71717a",
    //     },
    //     source: "1",
    //     sourceHandle: "1680558635217",
    //     target: "1680558646873",
    //     targetHandle: "top",
    //     id: "reactflow__edge-11680558635217-1680558646873top",
    //   },
    //   {
    //     type: "default",
    //     style: {
    //       strokeWidth: 3,
    //     },
    //     markerEnd: {
    //       type: "arrowclosed",
    //       width: 20,
    //       height: 20,
    //       color: "#71717a",
    //     },
    //     source: "1680558646873",
    //     sourceHandle: "right",
    //     target: "1680558663377",
    //     targetHandle: "top",
    //     id: "reactflow__edge-1680558646873right-1680558663377top",
    //   },
    //   {
    //     type: "default",
    //     style: {
    //       strokeWidth: 3,
    //     },
    //     markerEnd: {
    //       type: "arrowclosed",
    //       width: 20,
    //       height: 20,
    //       color: "#71717a",
    //     },
    //     source: "1680558663377",
    //     sourceHandle: "right",
    //     target: "1680558692807",
    //     targetHandle: "top",
    //     id: "reactflow__edge-1680558663377right-1680558692807top",
    //   },
    //   {
    //     type: "default",
    //     style: {
    //       strokeWidth: 3,
    //     },
    //     markerEnd: {
    //       type: "arrowclosed",
    //       width: 20,
    //       height: 20,
    //       color: "#71717a",
    //     },
    //     source: "1680558692807",
    //     sourceHandle: "right",
    //     target: "2",
    //     targetHandle: "top",
    //     id: "reactflow__edge-1680558692807right-2top",
    //   },
    //   {
    //     type: "default",
    //     style: {
    //       strokeWidth: 3,
    //     },
    //     markerEnd: {
    //       type: "arrowclosed",
    //       width: 20,
    //       height: 20,
    //       color: "#71717a",
    //     },
    //     source: "2",
    //     sourceHandle: "1680558723055",
    //     target: "1680558729697",
    //     targetHandle: "top",
    //     id: "reactflow__edge-21680558723055-1680558729697top",
    //   },
    //   {
    //     type: "default",
    //     style: {
    //       strokeWidth: 3,
    //     },
    //     markerEnd: {
    //       type: "arrowclosed",
    //       width: 20,
    //       height: 20,
    //       color: "#71717a",
    //     },
    //     source: "2",
    //     sourceHandle: "1680558423299",
    //     target: "1680558728593",
    //     targetHandle: "top",
    //     id: "reactflow__edge-21680558423299-1680558728593top",
    //   },
    // ]);
  }, []);

  const getInfo = useCallback(() => {
    function transformObjectsToBlocks(flowData, nodeData) {
      const { edges, nodes } = flowData;

      // Crie um mapa de conexões (sourceId: [targetId])
      const connections = edges.reduce((acc, edge) => {
        if (!acc[edge.source]) {
          acc[edge.source] = [];
        }
        acc[edge.source].push({
          target: edge.target,
          sourceHandle: edge.sourceHandle,
        });
        return acc;
      }, {});

      const blocks = nodes.map((node) => {
        const content = nodeData[node.id]?.content || "";
        const selectedVariable = nodeData[node.id]?.selectedVariable;
        const ways = nodeData[node.id]?.ways || [];

        let block = {
          key: node.id,
          node_type: node.type,
          content_data: {
            message: content,
          },
          block_origin_key: [],
          block_target_key: connections[node.id]
            ? connections[node.id].map((conn) => conn.target)
            : [],
          ways: [],
        };

        if (selectedVariable) {
          block["save_to_variable"] = selectedVariable.value;
        }

        if (node.type === "selector" || node.type === "startNode") {
          block.content_data.variable =
            nodeData[node.id]?.content_data?.variable ?? null;
          block.use_ways = true;
          block.ways = ways.map((way) => ({
            key: way.id,
            term: way.term,
            condition: way.type,
            block_target_key: connections[node.id].find(
              (conn) => conn.sourceHandle === way.id
            )?.target,
          }));
        }

        if (node.type === "setVariableNode") {
          block.content_data.variable = selectedVariable.value;
          block.content_data.content = content;
        }

        return block;
      });

      // Atualizar block_origin_key
      blocks.forEach((block) => {
        if (block.node_type === "selector" || block.node_type === "startNode") {
          block.ways.forEach((way) => {
            const targetBlock = blocks.find(
              (b) => b.key === way.block_target_key
            );
            if (targetBlock) {
              targetBlock.block_origin_key.push(way.key);
            }
          });
        } else {
          block.block_target_key.forEach((targetId) => {
            const targetBlock = blocks.find((b) => b.key === targetId);
            if (targetBlock) {
              targetBlock.block_origin_key.push(block.key);
            }
          });
        }
      });

      const triggerBlock = blocks.filter((i) => i.key === "1")[0];

      const trigger = triggerBlock.ways;

      var final = {
        name: "Flow",
        user: "641428ac4c89cd28836b09fa",
        trigger,
        blocks: blocks
          .filter((i) => i.key !== "1")
          .map((i) => ({
            ...i,
            block_target_key: Array.isArray(i.block_target_key)
              ? i.block_target_key[0]
              : i.block_target_key,
          })),
      };

      return final;
    }

    const data = {
      ...transformObjectsToBlocks({ nodes, edges }, nodeData),
      flowData: {
        nodes,
        edges,
        nodeData,
      },
    };

    axios.put(
      `https://3333-isaquecastr-wppappbacke-4b3wz0fz0lg.ws-us93.gitpod.io/templates/64268b4b76ea4d5e4f2b2e2c`,
      data
    );

    console.log({ nodes, edges });
    console.log(nodeData);
    console.log(data);
    // nodeData

    // console.log({
    //   nodes,
    //   edges,
    //   reactFlowInstance,
    //   reactFlowWrapper
    // })
  }, [nodes, edges, nodeData]);

  return (
    <>
      {/* <NavBar /> */}
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
            <button
              className="fixed right-10 top-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={getInfo}
            >
              Salvar
            </button>

            <Aside />
          </div>
        </ContextMenu.Root>
      </ReactFlowProvider>
    </>
  );
}
