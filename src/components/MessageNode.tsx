import * as ContextMenu from "@radix-ui/react-context-menu";
import { FormHandles, SubmitHandler } from "@unform/core";
import { Form } from "@unform/web";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Handle, Position } from "reactflow";
import Input from "./Input";
import NodeHeader from "./Nodes/NodeHeader";
import Textarea from "./Textarea";

const MessageNodeComponent = memo(() => {
  const [blured, setBlured] = useState(true);

  const [labelText, setLabelText] = useState<string>("");

  const inputRef = useRef<any>(null);
  const formatVariables = useCallback((value: string) => {
    console.log("go format");
    const formattedValue = value.replace(
      /(?<!<span>)%(\w+)%(?![^<]*<\/span>)/g,
      (match: string) => {
        return `<span class="bg-sky-400 pr-2 pl-2 inline-flex font-medium items-center  text-white rounded-xl ">${match}</span>${" "}`;
      }
    );

    inputRef.current.innerHTML = formattedValue;
    console.log(formattedValue);

    return formattedValue;
  }, []);

  return (
    <div
      className="nodrag cursor-text min-h-[80px] max-h-[200px] bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      contentEditable={true}
      ref={inputRef}
      onBlur={(e: any) => formatVariables(e.target.textContent)}
      onFocus={(e) => {
        setBlured(false);
      }}
    >
      Olá, seja bem vindo!
    </div>
  );
});

const MessageNode = memo((props) => {
  const formRef = useRef<FormHandles>(null);
  const handleSubmit: SubmitHandler<FormData> = (data) => {
    console.log(formRef);
  };

  // useEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.addEventListener("onblur", (e: any) => {
  //       setLabelText(formatVariables(e.target.textContent));
  //       setBlured(true);
  //     });
  //   }
  // }, [inputRef.current]);

  return (
    <ContextMenu.Trigger>
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
          title=" Enviar mensagem"
          color="bg-green-500"
          message="Envie uma mensagem de texto para o usuário"
        />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <label
            htmlFor={"term"}
            className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
          >
            Mensagem:
          </label>
          <MessageNodeComponent />
          {/* <Input
            name="message"
            className="nodrag min-h-[80px] max-h-[200px] bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder='Ex.: "Bem vindo!"'
            dangerouslySetInnerHTML={{ __html: labelText }}
            onChange={(e) => setLabelText(formatVariables(e.target.value))}
          /> */}
          {/* {blured ? (
            <div
              className="nodrag min-h-[80px] max-h-[200px] bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              dangerouslySetInnerHTML={{ __html: labelText }}
            ></div>
          ) : (
            <Textarea
              name={"message"}
              onBlur={(e) => {
                formatVariables(e.target.value);
                setBlured(true);
              }}
              onFocus={(e) => {
                setBlured(false);
              }}
              className="nodrag min-h-[80px] max-h-[200px] bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder='Ex.: "Bem vindo!"'
              required
            ></Textarea>
          )} */}
        </Form>
      </div>
    </ContextMenu.Trigger>
  );
});

export default MessageNode;
