import React, { useEffect, useRef } from "react";
import { useField } from "@unform/core";

export default function Radio({ name, options }: any) {
  const inputRefs = useRef<any>([]);
  const { fieldName, registerField, defaultValue }: any = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      path: "value",
      ref: inputRefs.current,
      getValue(refs: any) {
        const checked = refs.find((ref: any) => ref.checked);

        return checked ? checked.value : null;
      },
      setValue(refs: any, value: any) {
        const item = refs.find((ref: any) => ref.value === value);

        if (item) {
          item.checked = true;
        }
      },
    });
  }, [fieldName, registerField]);

  return (
    <ul className="grid w-full gap-3 md:grid-cols-2">
      {options.map((option: any, index: any) => (
        <li>
          <input
            ref={(elRef) => (inputRefs.current[index] = elRef)}
            type="radio"
            name={fieldName}
            value={option.id}
            id={option.id}
            className="hidden peer"
            defaultChecked={defaultValue === option.id}
          />
          <label
            key={option.id}
            htmlFor={option.id}
            className="nodrag inline-flex items-center justify-center text-center w-full p-3 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <div className="block">
              <div className="w-full text-center text-sm font-semibold">
                {option.label}
              </div>
            </div>
          </label>
        </li>
      ))}
    </ul>
  );
}
