// src/utils/RichTextEditor/Editor.tsx

import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface TextEditorProps {
  toolbarWidth: string;
  editorHeight: string;
  defaultValue?: string;
  value?: string;
  onChange?: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  toolbarWidth,
  editorHeight,
  defaultValue = "",
  value,
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const editorValue = value !== undefined ? value : internalValue;

  const handleChange = (content: string) => {
    if (value === undefined) {
      setInternalValue(content);
    }
    if (onChange) {
      onChange(content);
    }
  };

  useEffect(() => {
    if (value === undefined) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, value]);

  useEffect(() => {
    const toolbarElement = document.querySelector(".ql-toolbar");
    if (toolbarElement) {
      toolbarElement.setAttribute("style", `width: ${toolbarWidth};`);
    }
    const containerElement = document.querySelector(".ql-container");
    if (containerElement) {
      containerElement.setAttribute("style", `height: ${editorHeight};`);
    }
  }, [toolbarWidth, editorHeight]);

  return (
    <div className="w-full h-auto">
      <ReactQuill
        value={editorValue}
        onChange={handleChange}
        theme="snow"
        placeholder="Start typing..."
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            [
              { align: "" },
              { align: "center" },
              { align: "right" },
              { align: "justify" },
            ],
            [{ indent: "-1" }, { indent: "+1" }], // Add indent buttons
          ],
        }}
        formats={[
          "header",
          "bold",
          "italic",
          "underline",
          "list",
          "bullet",
          "align",
          "indent",
        ]}
      />
    </div>
  );
};

export default TextEditor;
