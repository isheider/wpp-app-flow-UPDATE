import {
  Handle,
  Node,
  NodeProps,
  Position,
  useNodeId,
  useStore,
} from "reactflow";
import { NodeResizer, NodeResizeControl } from "@reactflow/node-resizer";

export function Square({ selected }: NodeProps) {
  return (
    <>
      <div className="bg-violet-500 rounded min-w-[200px] min-h-[200px] w-full h-full group">
        <Handle
          id="top"
          type="target"
          position={Position.Top}
          className="-top-5 bg-transparent w-3 h-3 border-2 border-blue-400"
        />
        <Handle
          id="bottom"
          type="target"
          position={Position.Bottom}
          className="-bottom-5 bg-transparent w-3 h-3 border-2 border-blue-400"
        />
        <Handle
          id="left"
          type="target"
          position={Position.Left}
          className="-left-5 bg-transparent w-3 h-3 border-2 border-blue-400"
        />
        <Handle
          id="right"
          type="target"
          position={Position.Right}
          className="-right-5 bg-transparent w-3 h-3 border-2 border-blue-400"
        />
      </div>
    </>
  );
}
