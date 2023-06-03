import React, { createContext, useContext, useEffect, useState } from "react";

const NodeDataContext: any = createContext({});

export const useNodeData = () => useContext(NodeDataContext);

export const NodeDataProvider = ({ children }: any) => {
  const [nodeData, setNodeData] = useState({});
  const [nodeUploads, setNodeUploads] = useState({});

  const [showEdgeDeleteLabel, setShowEdgeDeleteLabel] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentUploadModalId, setCurrentUploadModalId] = useState(false);
  const [currentUploadType, setCurrentUploadType] = useState("image");

  useEffect(() => {
    console.log("new data", nodeData);
  }, [nodeData]);

  return (
    <NodeDataContext.Provider
      value={{
        nodeData,
        setNodeData,
        showEdgeDeleteLabel,
        setShowEdgeDeleteLabel,
        nodeUploads,
        setNodeUploads,
        showUploadModal,
        setShowUploadModal,
        currentUploadModalId,
        setCurrentUploadModalId,
        currentUploadType,
        setCurrentUploadType,
      }}
    >
      {children}
    </NodeDataContext.Provider>
  );
};
