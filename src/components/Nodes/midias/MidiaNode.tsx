import * as ContextMenu from "@radix-ui/react-context-menu";
import { FormHandles, SubmitHandler } from "@unform/core";
import { Form } from "@unform/web";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Handle, Position } from "reactflow";
import NodeHeader from "../NodeHeader";
import { useNodeData } from "../../../contexts/NodeDataContext";

const MediaNodeComponent = memo(({ id }: any) => {
  const { nodeData, setNodeData }: any = useNodeData();
  const [mediaType, setMediaType] = useState(nodeData[id]?.content?.mediaType);
  const [url, setUrl] = useState(nodeData[id]?.content?.url || "");
  const [caption, setCaption] = useState(nodeData[id]?.content?.caption || "");

  const handleMediaTypeChange = (event: any) => {
    setMediaType(event.target.value);
    const newData = {
      ...nodeData,
      [id]: {
        ...nodeData[id],
        content: { ...nodeData[id]?.content, mediaType: event.target.value },
      },
    };
    setNodeData(newData);
  };

  const handleUrlChange = (event: any) => {
    setUrl(event.target.value);
    const newData = {
      ...nodeData,
      [id]: {
        ...nodeData[id],
        content: { ...nodeData[id]?.content, url: event.target.value },
      },
    };
    setNodeData(newData);
  };

  const handleCaptionChange = (event: any) => {
    setCaption(event.target.value);
    const newData = {
      ...nodeData,
      [id]: {
        ...nodeData[id],
        content: { ...nodeData[id]?.content, caption: event.target.value },
      },
    };
    setNodeData(newData);
  };

  return (
    <>
      {/* Renderize os botões de seleção de tipo de mídia */}
      <h3 className="mb-5 text-lg font-medium text-gray-900 dark:text-white">
        Tipo de mídia:
      </h3>
      <ul className="grid w-full mb-4 gap-6 md:grid-cols-2">
        <li>
          <input
            type="radio"
            id={id + "-media-image"}
            name={id + "-mediaType"}
            value="image"
            className="hidden peer"
            checked={mediaType === "image"}
            onChange={handleMediaTypeChange}
            required
          />
          <label
            htmlFor={id + "-media-image"}
            className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <div className="block">
              <div className="w-full text-lg font-semibold">Imagem</div>
            </div>
          </label>
        </li>
        <li>
          <input
            type="radio"
            id={id + "-media-video"}
            name={id + "-mediaType"}
            value="video"
            className="hidden peer"
            checked={mediaType === "video"}
            onChange={handleMediaTypeChange}
            required
          />
          <label
            htmlFor={id + "-media-video"}
            className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <div className="block">
              <div className="w-full text-lg font-semibold">Vídeo</div>
            </div>
          </label>
        </li>
        <li>
          <input
            type="radio"
            id={id + "-media-audio"}
            name={id + "-mediaType"}
            value="audio"
            className="hidden peer"
            checked={mediaType === "audio"}
            onChange={handleMediaTypeChange}
            required
          />
          <label
            htmlFor={id + "-media-audio"}
            className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <div className="block">
              <div className="w-full text-lg font-semibold">Áudio</div>
            </div>
          </label>
        </li>
        <li>
          <input
            type="radio"
            id={id + "-media-file"}
            name={id + "-mediaType"}
            value="file"
            className="hidden peer"
            checked={mediaType === "file"}
            onChange={handleMediaTypeChange}
            required
          />
          <label
            htmlFor={id + "-media-file"}
            className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <div className="block">
              <div className="w-full text-lg font-semibold">Documento</div>
            </div>
          </label>
        </li>
        {/* Repita o mesmo padrão para os outros tipos de mídia: vídeo, áudio e arquivo */}
      </ul>

      {/* Renderize o campo de URL */}
      <div className="mb-4">
        <label
          className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
          htmlFor={"url"}
        >
          URL da mídia:
        </label>
        <input
          type="text"
          name="url"
          value={url}
          onChange={handleUrlChange}
          className="nodrag cursor-text bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        />
      </div>

      {/* Renderize o campo de legenda, se aplicável */}
      {["image", "video"].includes(mediaType) && (
        <div>
          <label
            className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
            htmlFor={"caption"}
          >
            Legenda (opcional):
          </label>
          <textarea
            name="caption"
            value={caption}
            onChange={handleCaptionChange}
            className="nodrag flex align-top items-start cursor-text min-h-[80px] max-h-[200px] bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          />
        </div>
      )}
    </>
  );
});

const MediaNode = memo((props: any) => {
  const formRef = useRef<FormHandles>(null);
  const handleSubmit: SubmitHandler<FormData> = (data) => {
    console.log(formRef);
  };

  return (
    <ContextMenu.Trigger>
      <div className="w-96 bg-white border border-gray-200 rounded-lg shadow p-[25px] dark:bg-gray-800 dark:border-gray-700">
        <Handle
          type="target"
          id="top"
          position={Position.Top}
          className="-top-10  border-[6px] border-gray-50 bg-gray-400 w-7 h-7"
          onConnect={(params) => console.log("handle onConnect", params)}
        />
        <Handle
          type="source"
          id="right"
          position={Position.Right}
          className="-right-[35px] bg-gray-300 w-[20px] h-[20px] border-4 border-gray-700"
        />
        <NodeHeader
          title="Enviar mídia"
          color="bg-blue-500"
          message="Envie uma mídia (imagem, vídeo, áudio ou arquivo) para o usuário"
        />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <MediaNodeComponent id={props.id} />
        </Form>
      </div>
    </ContextMenu.Trigger>
  );
});

export default MediaNode;
