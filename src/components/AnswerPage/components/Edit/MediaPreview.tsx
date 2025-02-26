import React, { useState } from "react";
import { Image, Modal } from "antd";

interface MediaPreviewProps {
  dataEdit: {
    images: string[];
    videos: string[];
  };
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ dataEdit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

  const handleVideoClick = (video: string) => {
    setCurrentVideo(video);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setCurrentVideo(null);
    setIsModalOpen(false);
  };

  return (
    <div className="h-full p-4 bg-[#F5F9FF] rounded-3xl">
      <p className="text-black font-semibold text-base">
        Hình ảnh, video hiện tại
      </p>
      <div
        className="h-full mt-2 flex gap-2 flex-wrap overflow-y-auto"
        style={{ justifyContent: "flex-start" }}
      >
        {/* Hình ảnh */}
        <Image.PreviewGroup>
          {dataEdit.images.map((image, index) => (
            <div
              key={index}
              className="w-20 h-20 rounded-lg flex-shrink-0 border border-gray-300"
            >
              <Image
                height={"auto"}
                width={"auto"}
                src={image}
                alt={`Image ${index}`}
                className="w-full h-full object-cover rounded-lg"
                preview={{ mask: "Nhấn để xem" }}
              />
            </div>
          ))}
        </Image.PreviewGroup>

        {/* Video */}
        {dataEdit.videos.map((video, index) => (
          <div
            key={index}
            className="w-20 h-20 rounded-lg flex-shrink-0 border border-gray-300 cursor-pointer bg-gray-200 flex items-center justify-center"
            onClick={() => handleVideoClick(video)}
          >
            <video
              src={video}
              className="w-full h-full object-cover rounded-lg"
              muted
              preload="metadata"
            />
          </div>
        ))}
      </div>

      {/* Video Modal */}
      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={handleModalClose}
        centered
      >
        {currentVideo && (
          <video src={currentVideo} className="w-full" controls autoPlay />
        )}
      </Modal>
    </div>
  );
};

export default MediaPreview;
