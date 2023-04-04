import React, { createContext, useContext, useEffect, useState } from "react";

const NodeDataContext:any = createContext({});

export const useNodeData = () => useContext(NodeDataContext);

export const NodeDataProvider = ({ children }:any) => {
  const [nodeData, setNodeData] = useState({});


    useEffect(() => {
        console.log("new data", nodeData)
    },[nodeData])

  return (
    <NodeDataContext.Provider value={{ nodeData, setNodeData }}>
      {children}
    </NodeDataContext.Provider>
  );
};