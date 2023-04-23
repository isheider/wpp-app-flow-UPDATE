import { Canvas } from "../components/Canvas";
import NavBar from "../components/NavBar";
import { NodeDataProvider } from "../contexts/NodeDataContext";

export default function Template() {
  return (
    <NodeDataProvider>
      <div
        style={{ height: "100vh", width: "100vw" }}
        className="flex flex-col"
      >
        <Canvas />
      </div>
    </NodeDataProvider>
  );
}
