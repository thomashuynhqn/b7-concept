import { jsx as _jsx } from "react/jsx-runtime";
// src/utils/RichTextEditor/Editor.tsx
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
var TextEditor = function (_a) {
    var toolbarWidth = _a.toolbarWidth, editorHeight = _a.editorHeight, _b = _a.defaultValue, defaultValue = _b === void 0 ? "" : _b, value = _a.value, onChange = _a.onChange;
    // Maintain an internal state if no controlled value is provided.
    var _c = useState(defaultValue), internalValue = _c[0], setInternalValue = _c[1];
    // Use the controlled value if provided, otherwise use internal state.
    var editorValue = value !== undefined ? value : internalValue;
    // Handle changes from the editor.
    var handleChange = function (content) {
        // Update internal state only if component is uncontrolled.
        if (value === undefined) {
            setInternalValue(content);
        }
        if (onChange) {
            onChange(content);
        }
    };
    // Update internal state if defaultValue changes (and we're not controlled).
    useEffect(function () {
        if (value === undefined) {
            setInternalValue(defaultValue);
        }
    }, [defaultValue, value]);
    // Dynamically update toolbar and container styling.
    useEffect(function () {
        var toolbarElement = document.querySelector(".ql-toolbar");
        if (toolbarElement) {
            toolbarElement.setAttribute("style", "width: ".concat(toolbarWidth, ";"));
        }
        var containerElement = document.querySelector(".ql-container");
        if (containerElement) {
            containerElement.setAttribute("style", "height: ".concat(editorHeight, ";"));
        }
    }, [toolbarWidth, editorHeight]);
    return (_jsx("div", { className: "w-full h-auto", children: _jsx(ReactQuill, { value: editorValue, onChange: handleChange, theme: "snow", placeholder: "Start typing...", modules: {
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
            } }) }));
};
export default TextEditor;
