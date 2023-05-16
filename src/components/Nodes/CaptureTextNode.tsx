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

const MessageNodeComponent = memo(({ id }: any) => {
  const { nodeData, setNodeData }: any = useNodeData();
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event: any) => {
    const newData = {
      ...nodeData,
      [id]: { ...nodeData[id], content: event.target.textContent },
    };
    setNodeData(newData);
  };

  const text = nodeData[id]?.content || "Olá, seja bem vindo";

  const stylizeVariables = (text: string) => {
    return text.replace(
      /(%[\w\s]+%)/g,
      (match) =>
        `<span class="bg-blue-600 px-2 py-[2px] font-semibold leading-none inline-flex align-center items-center text-white rounded-full">${match}</span>`
    );
  };

  const handleBlur = (event: any) => {
    handleChange(event);
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <div
      contentEditable
      className="nodrag cursor-text min-h-[80px] max-h-[200px] bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      onBlur={handleBlur}
      onFocus={handleFocus}
      dangerouslySetInnerHTML={{
        __html: isFocused ? text : stylizeVariables(text),
      }}
    ></div>
  );
});

const CaptureTextNode = memo(({ id, data: propsData }: any) => {
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
          title="Perguntar"
          color="bg-yellow-300"
          nodeId={id}
          handleDeleteNode={propsData.handleDeleteNode}
          message="Capture o texto que o usuário digitar no chat após a mensagem"
        />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h3 className="flex justify-between items-center mt-[-5px] mb-2 text-base font-medium text-gray-900 dark:text-white">
            Salvar conteúdo:
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
            Mensage/Pergunta:
          </label>
          <MessageNodeComponent id={id} />
        </Form>
      </div>
    </ContextMenu.Trigger>
  );
});

export default CaptureTextNode;
