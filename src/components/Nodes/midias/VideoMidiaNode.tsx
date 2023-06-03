import * as ContextMenu from "@radix-ui/react-context-menu";
import { FormHandles, SubmitHandler } from "@unform/core";
import { Form } from "@unform/web";
import { memo, useEffect, useRef, useState } from "react";
import { Handle, Position } from "reactflow";
import { useNodeData } from "../../../contexts/NodeDataContext";
import NodeHeader from "../NodeHeader";

import { FaExchangeAlt, FaPlus } from "react-icons/fa";

const ImageMidiaNode = memo((props: any) => {
  const formRef = useRef<FormHandles>(null);
  const {
    nodeData,
    setNodeData,
    setShowUploadModal,
    setCurrentUploadModalId,
    setCurrentUploadType,
  }: any = useNodeData();

  const handleSubmit: SubmitHandler<FormData> = (data) => {};

  const [caption, setCaption] = useState(
    nodeData[props.id]?.content?.caption || ""
  );
  const handleCaptionChange = (event: any) => {
    setCaption(event.target.value);
    const newData = {
      ...nodeData,
      [props.id]: {
        ...nodeData[props.id],
        content: {
          ...nodeData[props.id]?.content,
          caption: event.target.value,
        },
      },
    };
    setNodeData(newData);
  };

  const handleOpenModal = () => {
    setCurrentUploadType("video");
    setCurrentUploadModalId(props.id);
    setShowUploadModal(true);
  };

  const [selectedLabel, setSelectedLabel] = useState("Adicionar Mídia");
  const [someMidiaSelected, setSomeMidiaSelected] = useState(0);

  useEffect(() => {
    if (nodeData[props.id]?.content?.midias) {
      const count = Object.values(nodeData[props.id]?.content?.midias).filter(
        Boolean
      ).length;

      if (count) {
        setSelectedLabel(`${count} mídia(s) selecionada`);
        setSomeMidiaSelected(count);
        if (count > 1) {
          handleCaptionChange({ target: { value: "" } });
        }
      } else {
        setSelectedLabel("Adicionar mídia");
        setSomeMidiaSelected(count);
      }
    }
  }, [nodeData[props.id]?.content?.midias]);

  return (
    <ContextMenu.Trigger>
      <div className="w-96 bg-white border border-gray-200 rounded-lg shadow p-[25px] dark:bg-gray-800 dark:border-gray-700">
        <Handle
          type="target"
          id="top"
          position={Position.Top}
          className="-top-10  border-[6px] border-gray-50 bg-gray-400 w-7 h-7 "
          onConnect={(params) => console.log("handle onConnect", params)}
        />
        <Handle
          type="source"
          id="right"
          position={Position.Right}
          className="-right-[35px] bg-gray-300 w-[20px] h-[20px] border-4 border-gray-700"
        />
        <NodeHeader
          title=" Enviar vídeo(s)"
          color="bg-green-500"
          nodeId={props.id}
          handleDeleteNode={props.data.handleDeleteNode}
          message="Envie um ou mais vídeos para o usuário"
        />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <label
            htmlFor={"term"}
            className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
          >
            Vídeos:
          </label>
          <button
            type="button"
            className={`nodrag mt-4 py-4 flex flex-row items-center align-center justify-center w-full font-semibold text-base ${
              someMidiaSelected
                ? "bg-orange-400 text-white"
                : "bg-blue-200 text-blue-800"
            } focus:outline-0 border-0  rounded-lg p-2`}
            onClick={handleOpenModal}
          >
            {someMidiaSelected ? (
              <FaExchangeAlt className="mr-4" fontSize={14} />
            ) : (
              <FaPlus className="mr-4" fontSize={14} />
            )}
            {selectedLabel}
          </button>
          <p className="text-base mt-4 font-medium text-gray-400 dark:text-gray-400">
            Selecione os vídeos
          </p>
          {someMidiaSelected < 2 && (
            <div className="mt-4">
              <label
                className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
                htmlFor={"caption"}
              >
                Legenda (opcional):
              </label>
              <textarea
                name="caption"
                placeholder="Legenda da imagem"
                value={caption}
                onChange={handleCaptionChange}
                className="nodrag flex align-top items-start cursor-text min-h-[60px] max-h-[200px] bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
          )}
        </Form>
      </div>
    </ContextMenu.Trigger>
  );
});

export default ImageMidiaNode;
