import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css'; // Importe os estilos do Quill

const VariableHighlightTextbox = ({ initialText = '', onTextChange }) => {
  const [text, setText] = useState(initialText);
  const quillRef = useRef(null);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  useEffect(() => {
    if (quillRef.current) {
      return;
    }

    const Variable = Quill.import('blots/inline');
    Variable.blotName = 'variable';
    Variable.tagName = 'span';
    Variable.className = 'variable';
    Quill.register(Variable);

    const quillInstance = new Quill(quillRef.current, {
      modules: {
        toolbar: false,
      },
      readOnly: true,
      theme: 'snow',
    });

    quillInstance.on('text-change', function (delta, oldDelta, source) {
      if (source === 'user') {
        quillInstance.updateContents(delta);
      }
    });

    quillRef.current = quillInstance;
  }, [quillRef]);

  const handleChange = (content, delta, source, editor) => {
    const rawText = editor.getText();
    setText(rawText);
    onTextChange(rawText);
  };

  const modules = {
    toolbar: false, // Desabilita a barra de ferramentas
  };

  return (
    <div className="highlight-textbox nodrag cursor-text min-h-[80px] max-h-[200px] bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
      <div ref={quillRef} />
      <ReactQuill
        value={text}
        onChange={handleChange}
        modules={modules}
        theme="snow"
        className="highlight-textbox nodrag cursor-text min-h-[80px] max-h-[200px] bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      />
    </div>
  );
};

export default VariableHighlightTextbox;