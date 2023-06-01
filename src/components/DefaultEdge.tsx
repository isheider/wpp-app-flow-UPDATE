import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  useEdgesState,
} from "reactflow";

import { Tooltip } from "react-tooltip";
import { useNodeData } from "../contexts/NodeDataContext";

import { confirmAlert } from "react-confirm-alert";

export function DefaultEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data,
    markerEnd,
  } = props;
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    offset: 30,
    targetX,
    targetY,
    targetPosition,
  });

  const { setShowEdgeDeleteLabel }: any = useNodeData();

  return (
    <>
      {/* <BaseEdge path={edgePath} {...props} /> */}
      {/* <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <button className="edgebutton" onClick={(event) => alert("delete")}>
            ×
          </button>
        </div>
      </EdgeLabelRenderer> */}
      <path
        // id={id}
        // style={style}
        // className=""
        // data-tooltip-id="my-tooltip"
        onMouseEnter={() => setShowEdgeDeleteLabel(true)}
        onMouseLeave={() => setShowEdgeDeleteLabel(false)}
        onClick={() => {
          setShowEdgeDeleteLabel(false);
          data.handleDeleteEdge(id);
        }}
        // data-tooltip-content="Hello world!"
        className="edge-flow-selector bg-red-300 stroke-[80px] fill-none stroke-transparent"
        d={edgePath}
        // markerEnd={markerEnd}
      />
      <path
        id={id}
        style={style}
        className="edge-flow stroke-2 fill-none stroke-zinc-500"
        d={edgePath}
        markerEnd={markerEnd}
      />
    </>
  );
}
