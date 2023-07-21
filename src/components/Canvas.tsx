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

import MidiaUploadModal from "./MidiaUploadModal";

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
import ImageNode from "./Nodes/midias/ImageMidiaNode";
import VideoNode from "./Nodes/midias/VideoMidiaNode";
import RecordingNode from "./Nodes/midias/RecordingMidiaNode";
import AudioNode from "./Nodes/midias/AudioMidiaNode";
import DocumentNode from "./Nodes/midias/DocumentMidiaNode";
import SetVariableNode from "./Nodes/SetVariableNode";
import DelayNode from "./Nodes/DelayNode";
import StartNode from "./Nodes/StartNode";
import CaptureTextNode from "./Nodes/CaptureTextNode";
import { DefaultEdge } from "./DefaultEdge";
import Aside from "./Aside";
import api from "../services/api";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";

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
  recordingNode: RecordingNode,
  audioNode: AudioNode,
  documentNode: DocumentNode,
  delayNode: DelayNode,
  captureTextNode: CaptureTextNode,
  setVariableNode: SetVariableNode,
  startNode: StartNode,
};

const EDGE_TYPES = {
  default: DefaultEdge,
};

export function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { nodeData, setNodeData, showEdgeDeleteLabel } = useNodeData();

  const { id, checkSession } = useAuth();

  const reactFlowWrapper = useRef<any>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const onConnect = useCallback(
    (params: Connection) => {
      return setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const handleDeleteEdge = useCallback(
    (id: any) => {
      setEdges((edges) => {
        const left = edges.filter((edge) => edge.id !== id);
        return left;
      });
    },
    [nodes, edges]
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
            setNodeData({});
            setLoadingFlow(false);
            setCurrentFlowName("Fluxo sem título");
          } else {
            setLoadingFlow(true);
            const { data } = await api.get(`templates/${templateId}`);

            // 64268b4b76ea4d5e4f2b2e2c

            if (data) {
              setNodeData(data.flowData.nodeData ?? {});
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
                block.content_data.variable = selectedVariable?.value ?? null;
                // block.content_data.variable =
                  // nodeData[node.id]?.content_data?.variable ?? null;
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

            if (trigger.length === 0 || blocks.length === 0) {
              throw new Error("error");
            }

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

  const [showImportConfirmationModal, setShowImportConfirmationModal] =
    useState(false);

  const fileInput = useRef(null);

  const handleExport = useCallback(async () => {
    const dataToExport = {
      nodes,
      edges,
      nodeData,
    };

    const exportName = `exported-${Date.now()}`;

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify({ data: dataToExport }));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
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

  const handleImportFileExplorer = useCallback(() => {
    if (fileInput && fileInput.current) {
      fileInput.current.click();
    }
  }, [fileInput]);

  const handleImport = useCallback(
    (event: any) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const obj = JSON.parse(event.target.result);

          console.log("go");
          if (
            obj &&
            obj.data &&
            obj.data.nodes &&
            obj.data.edges &&
            obj.data.nodeData
          ) {
            setNodes(obj.data.nodes);
            setEdges(obj.data.edges);
            setNodeData(obj.data.nodeData);

            toast.success("Fluxo importado e reescrito com sucesso.");
          } else {
            console.log("fall");
            toast.error(
              "Ocorreu um erro ao tentar importar o fluxo, confira o arquivo e tente novamente."
            );
          }

          setShowImportConfirmationModal(false);
        } catch (err) {
          console.log("fallll");
          setShowImportConfirmationModal(false);
          toast.error(
            "Ocorreu um erro ao tentar importar o fluxo, confira o arquivo e tente novamente."
          );
        }
      };
      try {
        reader.readAsText(file);
      } catch (err) {
        console.log("fallll");
        setShowImportConfirmationModal(false);
        toast.error(
          "Ocorreu um erro ao tentar importar o fluxo, confira o arquivo e tente novamente."
        );
      }
    },
    [
      nodes,
      edges,
      id,
      checkSession,
      nodeData,
      templateId,
      currentActive,
      currentFlowName,
      setNodes,
      setEdges,
      setNodeData,
    ]
  );

    const [manualHookShow, setManualHookShow] = useState(false)

    const handleManualHook = useCallback(async (target, hook) => {

      await api.post('/wpp-api-custom-target', {
        hook,
        target
      })

    },[
      nodes,
      edges,
      id,
      checkSession,
      nodeData,
      templateId,
      currentActive,
      currentFlowName,
      setNodes,
      setEdges,
      setNodeData,
    ])

  useEffect(() => {
    console.log({
      nodes,
      edges,
      nodeData,
    });
  }, [nodes, edges, nodeData]);

  const [numeroCliente, setNumeroCliente] = useState('');
  const [gatilho, setGatilho] = useState('');

  const handleChangeNumber = (event) => {
    // Remove qualquer caractere não numérico
    const numeroFormatado = event.target.value.replace(/\D/g, '');
    setNumeroCliente(numeroFormatado);
  };

  const handleChangeHook = (event) => {
    setGatilho(event.target.value);
  };

  const sendDirectMessage = useCallback(async () => {

    if(gatilho === "" || numeroCliente === "") {
      toast.error("Preencha os dados")
      return;
    }

    if(numeroCliente.length < 12) {
      toast.error("O número deve seguir o padrão correto, use o código do país, DDD, e o número sem o 9 da frente");
      return;
    }

    setLoadingSave(true);
    
    setManualHookShow(false);

    await handleSave()

    setGatilho('')
    setNumeroCliente('')
    
    try {

      
      await handleManualHook(numeroCliente, gatilho)
      toast.success("Mensagem enviada, aguarde para verificar se o envio foi bem sucedido.")
      
      setLoadingSave(false);
    }catch(err) {

      toast.error("Erro ao enviar fluxo, aguarde e tente novamente.")
      
      setLoadingSave(false);

    }

  }, [
    gatilho,
    numeroCliente,
    nodes,
    edges,
    id,
    checkSession,
    nodeData,
    templateId,
    currentActive,
    currentFlowName,
    setNodes,
    setEdges,
    setNodeData,
  ])

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
      <div
        className={`${
          showImportConfirmationModal ? "" : "hidden"
        } fixed flex bg-gray-500/50 items-center justify-center top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%)] max-h-full`}
      >
        <div className="relative w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              // data-modal-hide="popup-modal"
              onClick={() => setShowImportConfirmationModal(false)}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-6 text-center">
              <svg
                aria-hidden="true"
                className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Tem certeza que deseja sobrescrever o fluxo com uma importação?
              </h3>
              <button
                onClick={handleImportFileExplorer}
                // data-modal-hide="popup-modal"
                type="button"
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
              >
                Sim, tenho
              </button>
              <button
                // data-modal-hide="popup-modal"
                onClick={() => setShowImportConfirmationModal(false)}
                type="button"
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                Não, cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
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
                data: {
                  handleDeleteEdge,
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

            <MidiaUploadModal />

            {showEdgeDeleteLabel && (
              <div className="w-full  flex justify-center mx-auto absolute bottom-20 text-center z-50">
                <span className="bg-zinc-800/90 rounded-md py-4 px-10 text-white font-bold">
                  Apagar conexão entre Widgets
                </span>
              </div>
            )}
            {/* <Tooltip
              anchorSelect=".my-anchor-element"
              place="bottom"
              type="dark"
              effect="float"
            /> */}

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
              <>
                <div className="flex items-center absolute right-10 top-10">
                  {manualHookShow ? (
                    <div 
                    className="flex relative flex-col  justify-start"
                    >
                      <div
                        className="flex"
                      >
                     <label htmlFor="countries" className="inline-block h-[40px] mr-4 text-sm font-medium text-gray-900 dark:text-white">
        Selecione o gatilho
      </label>
      <select
        id="countries"
        className="inline-block h-[40px] mr-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full  p-2.5 pr-8 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={gatilho}
        onChange={handleChangeHook}
      >
        <option value="">Escolha um dos gatilhos do fluxo</option>

        {nodeData['1'].ways.map((way) => (
          <option key={way.term} value={way.term}>
            {way.term}
          </option>
        ))}
      </select>
      <label htmlFor="n-target" className="inline-block h-[40px] mr-4 text-sm font-medium text-gray-900 dark:text-white">
      N° do cliente
      </label>
                    <input type="text"
                    placeholder="55 + DDD + NÚMERO SEM O 9"
                      className="nodrag mr-4 w-full overflow-y-auto cursor-text text-sm h-[40px] bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"

                      value={numeroCliente}
                    onChange={handleChangeNumber}
                    inputMode="numeric"
                    id="n-target"
                    pattern="[0-9]*"
                    
                    />
                    <button
                    onClick={sendDirectMessage}
                    className="text-white mr-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-zinc-600 dark:hover:bg-zinc-700 focus:outline-none dark:focus:ring-zinc-800"
                    type="button"
                    >
                    Enviar
                  </button>
                    <button
                    onClick={() => {
                      setManualHookShow(false);
                      setGatilho('');
                      setNumeroCliente('');
                    }}
                    className="text-white mr-4 bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-zinc-600 dark:hover:bg-zinc-700 focus:outline-none dark:focus:ring-zinc-800"
                    type="button"
                    >
                    Cancelar
                  </button>
</div>
<p
  className="absolute text-sm text-right text-gray-500 translate-y-1/2 -bottom-5"
>Ao começar o fluxo manualmente, o fluxo será salvo automaticamente em seu estado atual.</p>
                    </div>
                  ) : (

                    <button
                    onClick={() => setManualHookShow(true)}
                    className="text-white mr-4 bg-zinc-700 hover:bg-zinc-800 focus:ring-4 focus:ring-zinc-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-zinc-600 dark:hover:bg-zinc-700 focus:outline-none dark:focus:ring-zinc-800"
                    type="button"
                    >
                    Disparo manual
                  </button>
                    
                    )}
                  <button
                    // data-modal-target="popup-modal"
                    // data-modal-toggle="popup-modal"
                    onClick={() => setShowImportConfirmationModal(true)}
                    className="text-white mr-4 bg-zinc-700 hover:bg-zinc-800 focus:ring-4 focus:ring-zinc-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-zinc-600 dark:hover:bg-zinc-700 focus:outline-none dark:focus:ring-zinc-800"
                    type="button"
                  >
                    Importar
                  </button>

                  <button
                    className="text-white mr-4 bg-zinc-700 hover:bg-zinc-800 focus:ring-4 focus:ring-zinc-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-zinc-600 dark:hover:bg-zinc-700 focus:outline-none dark:focus:ring-zinc-800"
                    onClick={handleExport}
                  >
                    Exportar
                  </button>
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
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInput}
                    onChange={handleImport}
                  />

                  <button
                    className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                    onClick={handleSave}
                  >
                    Salvar
                  </button>
                </div>
              </>
            )}

            {!loadingFlow && <Aside />}
          </div>
        </ContextMenu.Root>
      </ReactFlowProvider>
    </>
  );
}
