import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Handle, Position } from "reactflow";

import CreatableSelect from "react-select/creatable";

import { SubmitHandler, Scope, FormHandles } from "@unform/core";
import { Form } from "@unform/web";

import { FaCheckCircle, FaPlus, FaTimesCircle } from "react-icons/fa";
import NodeHeader from "./NodeHeader";
import { blue, gray, green, zinc } from "tailwindcss/colors";
import { useNodeData } from "../../contexts/NodeDataContext";

const CompareWay = memo(
  ({
    id,
    noCloseAllowed,
    removed,
    index,
    removeWay,
    onChange,
    term,
    type,
  }: any) => {
    const handleInputChange = (e: any) => {
      const { name, value } = e.target;
      onChange(id, name, value);
    };

    const handleRadioChange = (e: any) => {
      const { name, value } = e.target;
      onChange(id, "type", value);
    };

    return (
      <div
        style={removed ? { display: "none" } : {}}
        className="nodrag p-4 mt-[25px] rounded-lg relative bg-gray-200"
      >
        {!noCloseAllowed && (
          <div
            onClick={() => removeWay(id)}
            className="cursor-pointer absolute top-4 right-4 text-gray-500"
          >
            <FaTimesCircle fontSize={18} />
          </div>
        )}
        <Handle
          type="source"
          position={Position.Right}
          className="absolute -right-[35px] bg-gray-300 w-[20px] h-[20px] border-4 border-gray-700"
          id={id}
        />
        <Scope path={`ways[${id}]`}>
          <label
            htmlFor={"term"}
            className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
          >
            Termo:
          </label>
          <input
            type="text"
            name={"term"}
            id={"term"}
            className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder='Ex.: "Pinterest"'
            value={term}
            onChange={handleInputChange}
            required
          />
          <label
            htmlFor="email"
            className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
          >
            Tipo de correspondência:
          </label>
          <ul className="grid w-full gap-3 md:grid-cols-2">
            <li>
              <input
                type="radio"
                name={"type-" + id}
                value="exact"
                id={"exact-" + id + "-" + index}
                className="hidden peer"
                checked={type === "exact"}
                onChange={handleRadioChange}
              />
              <label
                htmlFor={"exact-" + id + "-" + index}
                className="nodrag inline-flex items-center justify-center text-center w-full p-3 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div className="block">
                  <div className="w-full text-center text-sm font-semibold">
                    EXATA
                  </div>
                </div>
              </label>
            </li>
            <li>
              <input
                type="radio"
                name={"type-" + id}
                value="contain"
                id={"contain-" + id + "-" + index}
                className="hidden peer"
                checked={type === "contain"}
                onChange={handleRadioChange}
              />
              <label
                htmlFor={"contain-" + id + "-" + index}
                className="nodrag inline-flex items-center justify-center text-center w-full p-3 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div className="block">
                  <div className="w-full text-center text-sm font-semibold">
                    CONTÉM
                  </div>
                </div>
              </label>
            </li>
          </ul>
        </Scope>
      </div>
    );
  }
);

const ColorSelectorNode = memo(({ id, data, isConnectable, ...rest }: any) => {
  const formRef = useRef<FormHandles>(null);

  const { nodeData, setNodeData }: any = useNodeData();

  // Obtenha ways e selectedVariable do nodeData
  const ways = nodeData[id]?.ways || [];
  // const selectedVariable = nodeData[id]?.selectedVariable || null;

  // Use `useEffect` para sincronizar as mudanças no `nodeData` e atualizar o componente de acordo.
  useEffect(() => {
    // Atualize o componente com base nas mudanças em nodeData
  }, [nodeData]);
  const handleChange = (wayId: any, field: any, value: any) => {
    if (ways.length === 0) {
      return false;
    }

    const updatedWays = ways.map((way: any) =>
      way.id === wayId ? { ...way, [field]: value } : way
    );

    const newData = {
      ...nodeData,
      [id]: {
        ...nodeData[id],
        // content_data: {
        //   variable: selectedVariable.label,
        // },
        use_ways: true,
        ways: updatedWays,
        node: {
          id,
          data,
          ...rest,
        },
      },
    };
    setNodeData(newData);
  };

  const addWay = useCallback(() => {
    const newWay = {
      id: String(Date.now()),
      term: "",
      type: "contain",
    };
    setNodeData((prevNodeData: any) => {
      const updatedWays = [...(prevNodeData[id]?.ways || []), newWay];
      return {
        ...prevNodeData,
        [id]: { ...(prevNodeData[id] || {}), ways: updatedWays },
      };
    });
  }, [id, setNodeData]);

  const removeWay = useCallback(
    (wayId: string) => {
      setNodeData((prevNodeData: any) => {
        const updatedWays = prevNodeData[id]?.ways.filter(
          (way: any) => way.id !== wayId
        );
        return {
          ...prevNodeData,
          [id]: { ...(prevNodeData[id] || {}), ways: updatedWays },
        };
      });
    },
    [id, setNodeData]
  );

  const handleSubmit: SubmitHandler<FormData> = (data) => {
    console.log(formRef);
  };

  // const handleSelectedVariableChange = useCallback(
  //   (newVariable: any) => {
  //     setNodeData((prevNodeData: any) => {
  //       return {
  //         ...prevNodeData,
  //         [id]: { ...(prevNodeData[id] || {}), selectedVariable: newVariable },
  //       };
  //     });
  //   },
  //   [id, setNodeData]
  // );

  return (
    <div className="w-96 bg-white border border-gray-200 rounded-lg shadow p-[25px] dark:bg-gray-800 dark:border-gray-700">
      {/* <Handle
        type="target"
        id="top"
        position={Position.Top}
        className="-top-10 border-[6px] border-gray-50 bg-gray-400 w-7 h-7 "
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      /> */}
      {/* <div>
Custom Color Picker Node: <strong>{data.color}</strong>
</div> */}
      <NodeHeader
        title="Início"
        color="bg-blue-500"
        message="Defina os gatilhos que farão o fluxo começar"
      />

      <Form
        ref={formRef}
        onSubmit={handleSubmit}
        onChange={() => {}}
        className="nodrag"
      >
        {ways.map((way: any, index: number) => (
          <CompareWay
            key={way.id}
            id={way.id}
            index={index}
            noCloseAllowed={index === 0}
            removeWay={removeWay}
            onChange={handleChange}
            term={way.term}
            type={way.type}
          />
        ))}
        <button
          type="button"
          className="nodrag mt-4 py-4 flex flex-row items-center align-center justify-center w-full font-semibold text-base bg-blue-200 focus:outline-0 border-0 text-blue-800 rounded-lg p-2"
          onClick={addWay}
        >
          <FaPlus className="mr-4" fontSize={14} />
          Adicionar caminho
        </button>
      </Form>
    </div>
  );
});

export default ColorSelectorNode;
