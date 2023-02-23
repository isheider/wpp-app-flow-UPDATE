import { Handle, Position } from "reactflow";
import NodeHeader from "./NodeHeader";

export default function () {
  return (
    <div className="w-96 pb-3 bg-white border border-gray-200 rounded-lg shadow p-[25px] dark:bg-gray-800 dark:border-gray-700">
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        className="absolute -right-[35px] bg-gray-300 w-[20px] h-[20px] border-4 border-gray-700"
      />

      <NodeHeader
        title="Início"
        color="bg-red-500"
        message="Começo do fluxo, os blocos devem começar a partir daqui:"
      />
    </div>
  );
}
