import * as ContextMenu from "@radix-ui/react-context-menu";
import { FormHandles, SubmitHandler } from "@unform/core";
import { Form } from "@unform/web";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Handle, Position } from "reactflow";
import Input from "../Input";
import NodeHeader from "./NodeHeader";
import Textarea from "../Textarea";
import { zinc } from "tailwindcss/colors";

const ImageNodeComponent = memo(() => {
  const [image, setImage] = useState<any>(null);

  const addImage = useCallback(async (img: any) => {
    if (img.type.includes("image")) {
      setImage(img);
    } else {
      return;
    }
  }, []);

  return (
    <>
      {image ? (
        <>
          <div
            className="h-48"
            style={{
              width: "100%",
              backgroundImage: `url(${URL.createObjectURL(image)})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundColor: zinc["100"],
            }}
          ></div>
          <small className="text-sm text-right block mb-2 ml-auto mt-2">
            {image.name}
          </small>
          <button
            type="button"
            onClick={() => setImage(null)}
            className="py-2.5 w-full px-5 mt-4 text-base font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Trocar Imagem
          </button>
          <label
            htmlFor={"caption"}
            className="block mt-4 mb-2 text-base font-medium text-gray-900 dark:text-white"
          >
            Legenda:
          </label>
          <Textarea
            name={"caption"}
            className="nodrag min-h-[80px] max-h-[200px] bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="Legenda da imagem (opcional)"
            required
          />
        </>
      ) : (
        <div className="flex mt-4 items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                aria-hidden="true"
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Clique para enviar</span> ou
                arraste e solte
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG (MAX. 5mb)
              </p>
            </div>
            <input
              multiple={false}
              id="dropzone-file"
              onChange={(e: any) => addImage(e.target.files[0])}
              type="file"
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>
      )}
    </>
  );
});

const ImageNode = memo(() => {
  const formRef = useRef<FormHandles>(null);
  const handleSubmit: SubmitHandler<FormData> = (data) => {
    console.log(formRef);
  };

  return (
    <ContextMenu.Trigger>
      <div className="w-96 bg-white border border-gray-200 rounded-lg shadow p-[25px] dark:bg-gray-800 dark:border-gray-700">
        <Handle
          type="target"
          id="top"
          position={Position.Top}
          className="-top-10  border-[6px] border-gray-50 bg-gray-400 w-7 h-7 "
        />
        <Handle
          type="source"
          id="right"
          position={Position.Right}
          className="-right-[35px] bg-gray-300 w-[20px] h-[20px] border-4 border-gray-700"
        />
        <NodeHeader
          title="Enviar imagem"
          color="bg-cyan-500"
          message="Envie uma imagem para o usuário"
        />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <label className="block mb-2 text-base font-medium text-gray-900 dark:text-white">
            Imagem:
          </label>
          <ImageNodeComponent />

          {/* <Textarea
            name={"message"}
            className="nodrag min-h-[80px] max-h-[200px] bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder='Ex.: "Bem vindo!"'
            required
          /> */}
        </Form>
      </div>
    </ContextMenu.Trigger>
  );
});

export default ImageNode;
