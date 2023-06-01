import * as ContextMenu from "@radix-ui/react-context-menu";
import { FormHandles, SubmitHandler } from "@unform/core";
import { Form } from "@unform/web";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Handle, Position } from "reactflow";
import NodeHeader from "./Nodes/NodeHeader";
import { useNodeData } from "../contexts/NodeDataContext";

import { HighlightWithinTextarea } from "react-highlight-within-textarea";

const MessageNodeComponent = memo(({ id }: any) => {
  const { nodeData, setNodeData }: any = useNodeData();

  const handleChange = (text: any) => {
    const newData = {
      ...nodeData,
      [id]: { ...nodeData[id], content: text },
    };
    setNodeData(newData);
  };

  const text = nodeData[id]?.content || "";

  return (
    <div className="nodrag overflow-y-auto cursor-text max-h-[200px] bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
      <HighlightWithinTextarea
        value={text}
        placeholder="Digite o conteúdo da mensagem"
        highlight={[
          {
            highlight: /%[^%]+%/g,
            className: "bg-blue-500 rounded-full px-1 text-white font-bold",
          },
        ]}
        onChange={handleChange}
      />
    </div>
    // <div
    //   contentEditable
    //   className="nodrag cursor-text min-h-[80px] max-h-[200px] bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
    //   onBlur={handleBlur}
    //   onFocus={handleFocus}
    //   dangerouslySetInnerHTML={{
    //     __html: isFocused ? text : stylizeVariables(text),
    //   }}
    // ></div>
  );
});

const MessageNode = memo((props: any) => {
  const formRef = useRef<FormHandles>(null);
  const handleSubmit: SubmitHandler<FormData> = (data) => {
    console.log(formRef);
  };

  useEffect(() => {
    console.log(props);
  }, [props]);

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
          title=" Enviar mensagem"
          color="bg-green-500"
          nodeId={props.id}
          handleDeleteNode={props.data.handleDeleteNode}
          message="Envie uma mensagem de texto para o usuário"
        />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <label
            htmlFor={"term"}
            className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
          >
            Mensagem:
          </label>
          <MessageNodeComponent id={props.id} />
        </Form>
      </div>
    </ContextMenu.Trigger>
  );
});

export default MessageNode;
