import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Handle, Position } from "reactflow";

import CreatableSelect from "react-select/creatable";

import { SubmitHandler, Scope, FormHandles } from "@unform/core";
import { Form } from "@unform/web";

import Input from "./Input";
import Radio from "./Radio";

import { FaCheckCircle, FaPlus, FaTimesCircle } from "react-icons/fa";
import NodeHeader from "./Nodes/NodeHeader";
import { blue, gray, green, zinc } from "tailwindcss/colors";

const CompareWay = memo(
  ({ id, noCloseAllowed, removed, index, removeWay }: any) => {
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
          <Input
            type="text"
            name={"term"}
            id={"term"}
            className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder='Ex.: "Pinterest"'
            required
          />
          <label
            htmlFor="email"
            className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
          >
            Tipo de correspondência:
          </label>
          <Radio
            name={"type-" + id}
            options={[
              { id: "exact-" + id + "-" + index, label: "EXATA" },
              { id: "contain-" + id + "-" + index, label: "CONTÉM" },
            ]}
          />
        </Scope>
      </div>
    );
  }
);

const ColorSelectorNode = memo(({ data, isConnectable }: any) => {
  const formRef = useRef<FormHandles>(null);

  const [ways, setWays] = useState([
    {
      id: String(Date.now()),
      term: "",
      type: "contain",
      removed: false,
    },
  ]);

  const [formData, setFormData] = useState([]);

  const [selectedVariable, setSelectedVariable] = useState<any>(null);

  const setDataToWay = useCallback(
    (way: string, data: any) => {
      setWays((old: any) => {
        var arr = [...old];

        arr = arr.map((i) => {
          if (i.id === way) {
            return {
              ...i,
              ...data,
            };
          } else {
            return i;
          }
        });

        console.log(arr);

        return arr;
      });
    },
    [ways]
  );

  useEffect(() => {
    console.log(formRef.current?.getData());
  }, [formRef.current]);

  const addWay = useCallback(
    (id: string) => {
      setWays((old: any) => [
        ...old,
        {
          id,
          term: "",
          type: "contain",
        },
      ]);
    },
    [ways]
  );

  const removeWay = useCallback(
    (id: string) => {
      var oldWays = [...ways];

      var arr = [...oldWays];
      console.log("before", arr);
      arr = arr.map((i) => {
        if (i.id !== id) {
          return { ...i };
        } else {
          return { ...i, removed: true };
        }
      });

      console.log("after", [...arr]);
      const newWays = [...arr];

      setWays(newWays);
    },
    [ways]
  );

  const handleSubmit: SubmitHandler<FormData> = (data) => {
    console.log(formRef);
  };

  return (
    <div className="w-96 bg-white border border-gray-200 rounded-lg shadow p-[25px] dark:bg-gray-800 dark:border-gray-700">
      <Handle
        type="target"
        id="top"
        position={Position.Top}
        className="-top-10  border-[6px] border-gray-50 bg-gray-400 w-7 h-7 "
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      {/* <div>
        Custom Color Picker Node: <strong>{data.color}</strong>
      </div> */}

      <NodeHeader
        title="Capturar e comparar"
        color="bg-blue-500"
        message="Faça caminhos no fluxo de acordo com o texto digitado pelo usuário"
      />
      <h3 className="flex justify-between items-center mt-[-5px] mb-2 text-base font-medium text-gray-900 dark:text-white">
        Salvar conteúdo:
        {selectedVariable && <FaCheckCircle color={blue["500"]} size={15} />}
      </h3>
      <CreatableSelect
        isClearable
        noOptionsMessage={() => "Digite um nome de variável para criá-la"}
        formatCreateLabel={(v) => `Criar "${v}"`}
        placeholder="Escolha ou crie uma variável"
        value={selectedVariable}
        className="text-base nodrag focus:outline-0 outline-0"
        onChange={(i: any) => setSelectedVariable(i)}
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
        options={[
          {
            label: "Nome",
            value: "nome",
          },
          {
            label: "Email",
            value: "email",
          },
        ]}
      />

      <Form ref={formRef} onSubmit={handleSubmit}>
        <>
          {ways.map((way, index, array) => {
            return (
              <>
                <CompareWay
                  index={index}
                  setDataToWay={setDataToWay}
                  term={way.term}
                  type={way.type}
                  removed={way?.removed ? true : false}
                  removeWay={removeWay}
                  noCloseAllowed={index === 0}
                  id={way.id}
                  key={index}
                />

                {index === array.length - 1 && (
                  <div
                    onClick={() => addWay(String(Date.now()))}
                    className="cursor-pointer w-9 mt-4 ml-auto mr-auto h-8 items-center flex text-center justify-center bg-gray-300 rounded-md text-gray-700"
                  >
                    <FaPlus />
                  </div>
                )}
              </>
            );
          })}
        </>
      </Form>

      {/* <input className="nodrag" name="term" type="text" onChange={data.onChange} defaultValue={data.term} /> */}
      {/* <Handle
        type="source"
        position={Position.Bottom}
        className="-bottom-10 bg-gray-300 w-5 h-5 border-4 border-gray-700"
        id="bottom"
        isConnectable={isConnectable}
      /> */}
    </div>
  );
});

export default ColorSelectorNode;
