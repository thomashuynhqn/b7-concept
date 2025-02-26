import React from "react";
import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

const VideoAdder: React.FC<{
  fileList: any[];
  onFileListChange: (fileList: any[]) => void;
}> = ({ fileList, onFileListChange }) => {
  // Simulate file upload; replace with your actual endpoint when ready.
  const customRequest = (options: any) => {
    const { file, onSuccess } = options;
    setTimeout(() => {
      onSuccess("ok", file);
    }, 1000);
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    customRequest,
    fileList,
    onChange(info) {
      const newFileList = info.fileList;
      onFileListChange(newFileList);
      if (info.file.status === "done") {
        message.success(`${info.file.name} tải lên thành công.`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} tải lên thất bại.`);
      }
    },
    listType: "picture-card",
  };

  // Plus card button for adding new files.
  const uploadButton = (
    <div>
      <PlusOutlined style={{ fontSize: 24 }} />
      <div style={{ marginTop: 8 }}>Thêm</div>
    </div>
  );

  return <Upload {...uploadProps}>{uploadButton}</Upload>;
};

export default VideoAdder;
