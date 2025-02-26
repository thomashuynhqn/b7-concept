import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { Upload, message } from "antd";
import React, { useState } from "react";

interface FileUploadProps {
  onChange?: (images: UploadFile[], videos: UploadFile[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onChange }) => {
  const [allFileImage, setAllFileImage] = useState<UploadFile[]>([]);
  const [allFileVideo, setAllFileVideo] = useState<UploadFile[]>([]);

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Function to handle file upload for both images and videos
  const uploadFiles = async (files: UploadFile[]) => {
    try {
      const imageFiles = files.filter((file) =>
        file.originFileObj?.type.startsWith("image/")
      );
      const videoFiles = files.filter((file) =>
        file.originFileObj?.type.startsWith("video/")
      );

      // Handle image uploads
      setAllFileImage(imageFiles);
      // Handle video uploads
      setAllFileVideo(videoFiles);

      // Pass uploaded files (both images and videos) to the parent component
      if (onChange) {
        console.log("🚀 ~ uploadFiles ~ allFileVideo:", imageFiles);
        console.log("🚀 ~ uploadFiles ~ allFileImage:", videoFiles);
        onChange(imageFiles, videoFiles);
      }
    } catch (error) {
      message.error("File upload failed.");
    }
  };

  const handleRemove = (file: UploadFile) => {
    // Lọc file khỏi danh sách `fileList`
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);

    // Cập nhật danh sách `allFileList` (images và videos)
    const updatedImages = allFileImage.filter((item) => item.uid !== file.uid);
    const updatedVideos = allFileVideo.filter((item) => item.uid !== file.uid);

    setAllFileImage(updatedImages);
    setAllFileVideo(updatedVideos);

    // Truyền danh sách mới qua callback nếu có
    if (onChange) {
      onChange(updatedImages, updatedVideos);
    }
  };

  // Handle file selection changes and accumulate the files
  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    setFileList([...newFileList]); // Accumulate files in local state
    const filesToUpload = newFileList.filter((file) => !file.url); // Only upload newly added files

    if (filesToUpload.length > 0) {
      await uploadFiles(filesToUpload);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      multiple
      listType="picture-card"
      fileList={fileList}
      onChange={handleChange}
      onRemove={handleRemove}
      beforeUpload={() => false} // Prevent automatic upload by AntD
      accept="image/*,video/*"
    >
      {uploadButton}
    </Upload>
  );
};

export default FileUpload;
