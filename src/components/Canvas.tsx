// @ts-nocheck

import { useCallback, useRef, useEffect, useState } from "react";
import * as Toolbar from "@radix-ui/react-toolbar";
import { Square as SquareIcon } from "phosphor-react";
import { zinc, sky, green } from "tailwindcss/colors";
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
  getConnectedEdges,
} from "reactflow";

import { Oval } from "react-loader-spinner";

import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { NodeDataProvider, useNodeData } from "../contexts/NodeDataContext";

import "reactflow/dist/style.css";
import "@reactflow/node-resizer/dist/style.css";
import { Square } from "./Square";
import CompareTextNode from "./CompareTextNode";
import MessageNode from "./MessageNode";
import NavBar from "./NavBar";
import MidiaNode from "./Nodes/midias/MidiaNode";
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
import api from "../services/api";
import { toast } from "react-toastify";

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
  midiaNode: MidiaNode,
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

  const { id, checkSession } = useAuth();

  const reactFlowWrapper = useRef<any>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const onConnect = useCallback(
    (params: Connection) => {
      return setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const handleDeleteNode = useCallback(
    (id: any) => {
      // const currentNode = nodes.filter((node) => node.id == id);

      setNodes((nds) => {
        const current = nds.filter((node) => node.id == id);
        const left = nds.filter((node) => node.id !== id);

        setEdges((eds) => {
          console.log(current);
          console.log(eds);
          const connecteds = getConnectedEdges(current, eds).map((i) => i.id);
          console.log("connecteds", connecteds);

          const newEdges = eds.filter((edge) => !connecteds.includes(edge.id));

          return newEdges;
        });

        return left;
      });
    },
    [nodes, edges]
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
        data: { label: `${type} node`, handleDeleteNode },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, handleDeleteNode]
  );

  const { templateId } = useParams();

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingFlow, setLoadingFlow] = useState(true);

  const [currentFlowName, setCurrentFlowName] = useState<any>(null);

  const [currentActive, setCurrentActive] = useState<boolean>(false);

  const handleChangeCurrentName = useCallback(
    (text) => {
      setCurrentFlowName(text);
    },
    [currentFlowName]
  );

  useEffect(() => {
    async function load() {
      if (templateId && checkSession) {
        if (!id) {
          navigate("/login");
        } else {
          if (templateId === "new") {
            setLoadingFlow(false);
            setCurrentFlowName("Fluxo sem título");
          } else {
            setLoadingFlow(true);
            const { data } = await api.get(`templates/${templateId}`);

            // 64268b4b76ea4d5e4f2b2e2c

            if (data) {
              setNodeData(data.flowData.nodeData);
              setNodes(
                data.flowData.nodes.map((i) => ({
                  ...i,
                  data: { ...i.data, handleDeleteNode },
                }))
              );
              setEdges(data.flowData.edges);
              setCurrentFlowName(data.name);
              setCurrentActive(data.active);
            }

            setLoadingFlow(false);
          }
        }
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
  }, [templateId, checkSession, id]);

  const navigate = useNavigate();

  const handleSave = useCallback(async () => {
    if (checkSession) {
      if (!id) {
        navigate("/login");
      } else {
        try {
          function transformObjectsToBlocks(flowData, nodeData) {
            const { edges, nodes } = flowData;

            const areConnecteds = getConnectedEdges(nodes, edges);
            console.log("connects", areConnecteds);

            const connectedIds = areConnecteds.map((i) => i.id);

            console.log(edges.filter((i) => connectedIds.indexOf(i.id) === -1));

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
              if (
                block.node_type === "selector" ||
                block.node_type === "startNode"
              ) {
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

            const removeAccents = (text: string) => {
              return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            };

            const trigger = triggerBlock.ways.map((m: any) => ({
              ...m,
              term: removeAccents(m.term),
            }));

            var final = {
              name: "Flow",
              user: id,
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

          if (templateId) {
            if (templateId === "new") {
              setLoadingSave(true);
              const { data: responseData } = await api.post(`/templates`, {
                ...data,
                name: currentFlowName,
                active: currentActive,
              });

              if (responseData && responseData._id) {
                toast.success("Flow criado com sucesso!");
                navigate(`/flows/${responseData._id}`);
              }

              setLoadingSave(false);
            } else {
              setLoadingSave(true);
              await api.put(`/templates/${templateId}`, {
                ...data,
                name: currentFlowName,
                active: currentActive,
              });

              toast.success("Flow editado com sucesso!");

              setLoadingSave(false);
            }
          }
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
        } catch (err) {
          toast.error("Verifique o fluxo antes de continuar");
        }
      }
    }
  }, [
    nodes,
    edges,
    id,
    checkSession,
    nodeData,
    templateId,
    currentActive,
    currentFlowName,
  ]);

  useEffect(() => {
    console.log({
      nodes,
      edges,
      nodeData,
    });
  }, [nodes, edges, nodeData]);

  async function handleChangeActive(active) {
    if (templateId) {
      if (templateId === "new") {
        setCurrentActive(active);
      } else {
        setCurrentActive(active);
      }
    }
  }

  return (
    <>
      <NavBar
        back="/flows"
        title={!currentFlowName ? "" : null}
        editable={currentFlowName}
        editableInitialValue={currentFlowName}
        editableValueChangeHandle={handleChangeCurrentName}
      />

      {/* <NavBar /> */}
      <ReactFlowProvider>
        <ContextMenu.Root>
          <div
            className="reactflow-wrapper relative h-full w-full"
            ref={reactFlowWrapper}
          >
            <ReactFlow
              nodeTypes={NODE_TYPES}
              edgeTypes={EDGE_TYPES}
              nodes={loadingFlow ? [] : nodes}
              edges={loadingFlow ? [] : edges}
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
                stroke: green["400"],
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
            {loadingSave ? (
              <Oval
                height={40}
                width={40}
                color="green"
                wrapperStyle={{}}
                wrapperClass="absolute right-10 top-10"
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="green"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            ) : (
              <div className="flex items-center absolute right-10 top-10">
                <label className="relative mr-4 inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    checked={currentActive}
                    onChange={(e) => handleChangeActive(e.target.checked)}
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {currentActive ? "Ativo" : "Inativo"}
                  </span>
                </label>
                <button
                  className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                  onClick={handleSave}
                >
                  Salvar
                </button>
              </div>
            )}

            {!loadingFlow && <Aside />}
          </div>
        </ContextMenu.Root>
      </ReactFlowProvider>
    </>
  );
}
