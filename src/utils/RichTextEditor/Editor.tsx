// src/utils/RichTextEditor/Editor.tsx

import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

interface TextEditorProps {
  toolbarWidth: string; // width for the toolbar
  editorHeight: string; // height for the editor container
  defaultValue?: string; // initial default value (optional)
  value?: string; // controlled value (optional)
  onChange?: (content: string) => void; // callback on content change
}

const TextEditor: React.FC<TextEditorProps> = ({
  toolbarWidth,
  editorHeight,
  defaultValue = "",
  value,
  onChange,
}) => {
  // Maintain an internal state if no controlled value is provided.
  const [internalValue, setInternalValue] = useState(defaultValue);

  // Use the controlled value if provided, otherwise use internal state.
  const editorValue = value !== undefined ? value : internalValue;

  // Handle changes from the editor.
  const handleChange = (content: string) => {
    // Update internal state only if component is uncontrolled.
    if (value === undefined) {
      setInternalValue(content);
    }
    if (onChange) {
      onChange(content);
    }
  };

  // Update internal state if defaultValue changes (and we're not controlled).
  useEffect(() => {
    if (value === undefined) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, value]);

  // Dynamically update toolbar and container styling.
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
            [
              { align: "" },
              { align: "center" },
              { align: "right" },
              { align: "justify" },
            ],
          ],
        }}
      />
    </div>
  );
};

export default TextEditor;
