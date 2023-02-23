import * as ContextMenu from "@radix-ui/react-context-menu";
import { FormHandles, SubmitHandler } from "@unform/core";
import { Form } from "@unform/web";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Handle, Position } from "reactflow";
import Input from "../Input";
import NodeHeader from "./NodeHeader";
import Textarea from "../Textarea";

const DelayNode = memo((props) => {
  const formRef = useRef<FormHandles>(null);
  const handleSubmit: SubmitHandler<FormData> = (data) => {
    console.log(formRef);
  };

  useEffect(() => {
    console.log(props);
  }, [props]);

  return (
    <ContextMenu.Trigger onClick={(e) => console.log(e)}>
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
          title="Adicionar Delay"
          color="bg-sky-500"
          message="Adicione uma espera entre um bloco e outro"
        />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <label
            htmlFor={"delay"}
            className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
          >
            Delay:
          </label>
          <Input
            name={"delay"}
            min={0}
            type="number"
            className="nodrag bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="Delay em segundos"
            required
          />
        </Form>
      </div>
    </ContextMenu.Trigger>
  );
});

export default DelayNode;
