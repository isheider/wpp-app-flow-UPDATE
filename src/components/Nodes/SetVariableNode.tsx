import * as ContextMenu from "@radix-ui/react-context-menu";
import { FormHandles, SubmitHandler } from "@unform/core";
import { Form } from "@unform/web";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Handle, Position } from "reactflow";
import Input from "../Input";
import NodeHeader from "./NodeHeader";
import Textarea from "../Textarea";
import CreatableSelect from "react-select/creatable";
import { FaCheckCircle, FaPlus, FaTimesCircle } from "react-icons/fa";
import { blue, gray } from "tailwindcss/colors";
import { useNodeData } from "../../contexts/NodeDataContext";
import HighlightWithinTextarea from "react-highlight-within-textarea";

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
        placeholder="Digite o conteúdo da variável"
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
const SetVariableNode = memo(({ id, data: propsData }: any) => {
  const formRef = useRef<FormHandles>(null);
  const handleSubmit: SubmitHandler<FormData> = (data) => {
    console.log(formRef);
  };

  const { nodeData, setNodeData }: any = useNodeData();
  const selectedVariable = nodeData[id]?.selectedVariable || null;
  const handleSelectedVariableChange = useCallback(
    (newVariable: any) => {
      setNodeData((prevNodeData: any) => {
        return {
          ...prevNodeData,
          [id]: { ...(prevNodeData[id] || {}), selectedVariable: newVariable },
        };
      });
    },
    [id, setNodeData]
  );

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
          title="Criar/Editar Variável"
          color="bg-yellow-300"
          nodeId={id}
          handleDeleteNode={propsData.handleDeleteNode}
          message="Capture o texto que o usuário digitar no chat"
        />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h3 className="flex justify-between items-center mt-[-5px] mb-2 text-base font-medium text-gray-900 dark:text-white">
            Variável:
            {selectedVariable && (
              <FaCheckCircle color={blue["500"]} size={15} />
            )}
          </h3>
          <CreatableSelect
            isClearable
            noOptionsMessage={() =>
              "Digite um nome de variável para criá-la ou selecioná-la"
            }
            formatCreateLabel={(v) => `Criar/selecionar "${v}"`}
            placeholder="Escolha ou crie uma variável"
            value={selectedVariable}
            className="text-base nodrag focus:outline-0 outline-0"
            onChange={handleSelectedVariableChange}
            styles={{
              input: (base) => ({
                ...base,
                "input:focus": {
                  boxShadow: "none",
                },
                color: gray["200"],
              }),
              placeholder: (base) => ({
                ...base,
                color: gray["400"],
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: selectedVariable ? gray["50"] : gray["200"],
              }),
              clearIndicator: (base) => ({
                ...base,
                color: selectedVariable ? gray["50"] : gray["200"],
              }),
              control: (base) => ({
                ...base,
                "control:focus": {
                  borderColor: "none",
                  outlineWidth: 0,
                },
                backgroundColor: selectedVariable ? blue["500"] : gray["700"],
                borderColor: gray["700"],
                color: selectedVariable ? gray["50"] : gray["200"],
              }),
              singleValue: (base) => ({
                ...base,
                color: selectedVariable ? gray["50"] : gray["300"],
                fontWeight: 600,
              }),
            }}
            options={[]}
          />
          <label
            htmlFor={"value"}
            className="block mt-4 mb-2 text-base font-medium text-gray-900 dark:text-white"
          >
            Valor:
          </label>
          <MessageNodeComponent id={id} />
        </Form>
      </div>
    </ContextMenu.Trigger>
  );
});

export default SetVariableNode;
