import { jsx as _jsx } from "react/jsx-runtime";
// src/utils/RichTextEditor/Editor.tsx
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
var TextEditor = function (_a) {
    var toolbarWidth = _a.toolbarWidth, editorHeight = _a.editorHeight, _b = _a.defaultValue, defaultValue = _b === void 0 ? "" : _b, value = _a.value, onChange = _a.onChange;
    var _c = useState(defaultValue), internalValue = _c[0], setInternalValue = _c[1];
    var editorValue = value !== undefined ? value : internalValue;
    var handleChange = function (content) {
        if (value === undefined) {
            setInternalValue(content);
        }
        if (onChange) {
            onChange(content);
        }
    };
    useEffect(function () {
        if (value === undefined) {
            setInternalValue(defaultValue);
        }
    }, [defaultValue, value]);
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
                    [{ list: "ordered" }, { list: "bullet" }],
                    [
                        { align: "" },
                        { align: "center" },
                        { align: "right" },
                        { align: "justify" },
                    ],
                    [{ indent: "-1" }, { indent: "+1" }], // Add indent buttons
                ],
            }, formats: [
                "header",
                "bold",
                "italic",
                "underline",
                "list",
                "bullet",
                "align",
                "indent",
            ] }) }));
};
export default TextEditor;
