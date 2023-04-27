import React, { memo, useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import NodeHeader from "./NodeHeader";
import { useNodeData } from "../../contexts/NodeDataContext";

const DelayNodeComponent = memo(({ id }: any) => {
  const { nodeData, setNodeData }: any = useNodeData();
  const [value, setValue] = useState(nodeData[id]?.content || 1);

  const handleChange = (event: any) => {
    const newValue = parseInt(event.target.value);
    setValue(newValue);

    const newData = {
      ...nodeData,
      [id]: { ...nodeData[id], content: newValue },
    };
    setNodeData(newData);
  };

  useEffect(() => {
    setValue(nodeData[id]?.content || 1);
  }, [id, nodeData]);

  return (
    <input
      type="number"
      className="nodrag cursor-text bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      value={value}
      min={1}
      onChange={handleChange}
    />
  );
});

const DelayNode = memo((props: any) => {
  return (
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
        title="Aguardar"
        color="bg-blue-500"
        message="Defina um tempo de espera antes de prosseguir para o próximo nó"
      />
      <label
        htmlFor={"term"}
        className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
      >
        Tempo de espera (em segundos):
      </label>
      <DelayNodeComponent id={props.id} />
    </div>
  );
});

export default DelayNode;
