import * as Toolbar from "@radix-ui/react-toolbar";
import {
  FaArrowLeft,
  FaClock,
  FaEnvelope,
  FaFilter,
  FaMicrophone,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import { ImTree } from "react-icons/im";

import { GiTalk } from "react-icons/gi";

import {
  AiFillControl,
  AiFillMessage,
  AiFillPicture,
  AiFillVideoCamera,
} from "react-icons/ai";

import { MdOutlinePictureAsPdf } from "react-icons/md";

const logic = [
  {
    label: "Comparar",
    type: "selector",
    icon: <FaFilter />,
    color: "bg-green-400",
  },
  {
    label: "Delay",
    type: "delayNode",
    icon: <FaClock />,
    color: "bg-green-400",
  },
  {
    label: "Capturar",
    type: "captureTextNode",
    icon: <FaEnvelope />,
    color: "bg-green-400",
  },

  {
    label: "Variáveis",
    type: "setVariableNode",
    icon: <AiFillControl />,
    color: "bg-green-400",
  },
];

const messages = [
  {
    label: "Mensagem",
    type: "messageNode",
    icon: <AiFillMessage />,
    color: "bg-green-400",
  },
  {
    label: "Imagem",
    type: "imageNode",
    icon: <AiFillPicture />,
    color: "bg-green-400",
  },
  {
    label: "Video",
    type: "videoNode",
    icon: <AiFillVideoCamera />,
    color: "bg-green-400",
  },
  {
    label: "Áudio",
    type: "audioNode",
    icon: <FaMicrophone />,
    color: "bg-green-400",
  },
  {
    label: "Documento",
    type: "documentNode",
    icon: <MdOutlinePictureAsPdf />,
    color: "bg-green-400",
  },
];

export default function () {
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Toolbar.Root className="absolute p-6 top-1/2 left-20  -translate-y-1/2 bg-gray-50 rounded-2xl shadow-lg border border-zinc-300 h-5/6 w-80 overflow-hidden">
      {/* <span className="block cursor-pointer mb-4">
        <Link to="/flows">
          <FaArrowLeft size={22} />
        </Link>
      </span> */}
      <h1 className="block text-2xl font-bold mb-3 text-gray-900 dark:text-white">
        Widgets
      </h1>
      <h2 className="font-semibold text-1xl mb-3">
        Recebimento de mensagens e lógicas
      </h2>
      <ul className="grid auto-rows-max grid-cols-2 gap-3">
        {logic.map((i) => (
          <button
            type="button"
            onDragStart={(event) => onDragStart(event, i.type)}
            draggable
            className="text-white text-left flex align-middle items-center justify-start bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            <span className="text-sm mr-1">{i.icon}</span>
            {i.label}
          </button>
        ))}
      </ul>

      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

      <h2 className="font-semibold text-1xl mb-3">Envio de mensagens</h2>
      <ul className="grid auto-rows-max grid-cols-2 gap-3">
        {messages.map((i) => (
          <button
            type="button"
            onDragStart={(event) => onDragStart(event, i.type)}
            draggable
            className="text-white text-left flex align-middle items-center justify-start bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            <span className="text-sm mr-1">{i.icon}</span>
            {i.label}
          </button>
        ))}
      </ul>

      {/* 
      <Toolbar.Button
        onDragStart={(event) => onDragStart(event, "messageNode")}
        draggable
        className="bg-white border h-17 rounded-lg"
      >
        MENSAGEM
      </Toolbar.Button> */}
    </Toolbar.Root>
  );
}
