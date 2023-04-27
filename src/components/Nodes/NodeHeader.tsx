import { FaTimes } from "react-icons/fa";

export default function ({
  title,
  message,
  color,
  nodeId,
  handleDeleteNode,
}: any) {
  return (
    <div className="flex flex-row justify-between">
      <div className="left">
        <h4 className="text-xl font-medium mb-3 text-gray-900 dark:text-white">
          <div
            className={`inline-block w-3 h-3 rotate-45 ${color} border-solid border border-2-cyan-400 mr-4`}
          />
          {title}
        </h4>
        <p className="text-base mb-8 font-medium text-gray-400 dark:text-gray-400">
          {message}
        </p>
      </div>
      {/* {handleDeleteNode && nodeId && (
        <div
          onClick={() => handleDeleteNode(nodeId)}
          className="cursor-pointer w-8 h-8 bg-gray-300"
        >
          <FaTimes />
        </div>
      )} */}
    </div>
  );
}
