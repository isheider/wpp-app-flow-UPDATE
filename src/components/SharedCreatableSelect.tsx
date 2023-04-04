import React, { useContext, useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { blue, gray } from "tailwindcss/colors";
import { useNodeData } from "../contexts/NodeDataContext";
// import { StylesConfig } from "react-select/src/styles";
// import { ValueType } from "react-select/src/types";
// import { gray, blue } from "../colors"; // Importe as cores do seu arquivo de cores.

type OptionType = {
  label: string;
  value: string;
};

type SharedCreatableSelectProps = {
  selectedVariable: any;
  handleSelectedVariableChange: (value: any) => void;
};

const SharedCreatableSelect: React.FC<SharedCreatableSelectProps> = ({
  selectedVariable,
  handleSelectedVariableChange,
}) => {
  const { nodeData, setNodeData }: any = useNodeData();
  const [options, setOptions] = useState<OptionType[]>([]);

  useEffect(() => {
    const allVariables = Object.values(nodeData).flatMap(
      (node: any) => node.variables || []
    );
    const uniqueVariables = Array.from(
      new Set(allVariables.map((variable) => variable.value))
    );
    const newOptions = uniqueVariables.map((variable) => ({
      label: variable,
      value: variable,
    }));

    setOptions(newOptions);
  }, [nodeData]);

  const handleCreateOption = (value: string) => {
    setOptions([...options, { label: value, value }]);
  };

  const styles: any = {
    // Coloque todos os estilos que você tem no seu CreatableSelect existente aqui.
    input: (base: any) => ({
      ...base,
      "input:focus": {
        boxShadow: "none",
      },
      color: gray["200"],
    }),
    placeholder: (base: any) => ({
      ...base,
      color: gray["400"],
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      color: selectedVariable ? gray["50"] : gray["200"],
    }),
    clearIndicator: (base: any) => ({
      ...base,
      color: selectedVariable ? gray["50"] : gray["200"],
    }),
    control: (base: any) => ({
      ...base,
      "control:focus": {
        borderColor: "none",
        outlineWidth: 0,
      },
      backgroundColor: selectedVariable ? blue["500"] : gray["700"],
      borderColor: gray["700"],
      color: selectedVariable ? gray["50"] : gray["200"],
    }),
    singleValue: (base: any) => ({
      ...base,
      color: selectedVariable ? gray["50"] : gray["300"],
      fontWeight: 600,
    }),
  };

  return (
    <CreatableSelect
      isClearable
      noOptionsMessage={() => "Digite um nome de variável para criá-la"}
      formatCreateLabel={(v) => `Criar "${v}"`}
      placeholder="Escolha ou crie uma variável"
      className="text-base nodrag focus:outline-0 outline-0"
      value={selectedVariable}
      onChange={handleSelectedVariableChange}
      onCreateOption={handleCreateOption}
      styles={styles}
      options={options}
    />
  );
};

export default SharedCreatableSelect;
