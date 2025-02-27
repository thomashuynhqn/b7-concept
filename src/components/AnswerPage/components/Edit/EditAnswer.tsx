import { Button, Col, Input, Modal, Row, UploadFile, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  clearLoading,
  openLoading,
} from "../../../../redux/slices/loadingSlice";
import {
  getResultsByID,
  postSubmitChange,
  postUpLoadImage,
  postUploadVideo,
} from "../../../../api/api";
import TextEditor from "../../../../utils/RichTextEditor/Editor";
import FileUpload from "../../../../utils/SharedComponents/FileUpload";
import MediaPreview from "./MediaPreview";
// import MediaPreview from "./MediaPreview";

// Define types for specific fields
interface Topic {
  id: number;
  name: string;
  description: string;
}

interface DataApi {
  id: number;
  question: string;
  answer: string;
  keywords: string[];
  like_count: number;
  topic: Topic | string; // Topic could be a string or object based on data
  images: string[];
  videos: string[];
}

const Edit = () => {
  const [searchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Initialize state for data editing
  const [dataEdit, setDataEdit] = useState<DataApi>({
    id: 1,
    question: "",
    answer: "",
    keywords: [],
    like_count: 1,
    topic: "",
    images: [],
    videos: [],
  });

  const [editedContent, setEditedContent] = useState(""); // State for edited content
  const [currentImages, setCurrentImages] = useState<string[]>([]); // State to track current images
  const [currentVideos, setCurrentVideos] = useState<string[]>([]); // State to track current videos
  const [newImages, setNewImages] = useState<UploadFile[]>([]); // State to track new images uploaded
  const [newVideos, setNewVideos] = useState<UploadFile[]>([]); // State to track new videos uploaded
  const _id = searchParams.get("id");

  useEffect(() => {
    if (!_id) {
      message.error("No ID provided.");
      return;
    }

    dispatch(openLoading());
    getResultsByID(Number(_id))
      .then((res) => {
        const fetchedData: DataApi = res.data; // Ensure type safety
        setDataEdit(fetchedData);
        setEditedContent(fetchedData.answer); // Initialize with the current answer
        setCurrentImages(fetchedData.images); // Initialize current images
        setCurrentVideos(fetchedData.videos); // Initialize current videos
        dispatch(clearLoading());
      })
      .catch((err) => {
        console.error("Error:", err);
        message.error("Failed to fetch data.");
        dispatch(clearLoading());
      });
  }, [_id, dispatch]);

  const handleEditorChange = useCallback((content: string) => {
    setEditedContent(content);
  }, []);

  const handleFileUploadChange = (
    images: UploadFile[],
    videos: UploadFile[]
  ) => {
    setNewImages(images);
    setNewVideos(videos);
  };

  const uploadImages = useCallback(
    async (id: string) => {
      try {
        for (const file of newImages) {
          // const formData = new FormData();
          // formData.append("image", file.originFileObj as File);

          // Gọi hàm upload và đợi kết quả
          const imageUrl = await postUpLoadImage(
            id,
            file.originFileObj as File
          );

          if (imageUrl) {
            setCurrentImages((prevImages) => [...prevImages, imageUrl]);
            message.success("Image uploaded successfully!");
          } else {
            throw new Error("Image upload failed.");
          }
        }
      } catch (error) {
        message.error("One or more images failed to upload.");
      }
    },
    [newImages]
  );

  const uploadVideos = useCallback(
    async (user_id: string) => {
      try {
        for (const file of newVideos) {
          // const formData = new FormData();
          // formData.append("video", file.originFileObj as File);

          // Gọi hàm upload và đợi kết quả
          const videoUrl = await postUploadVideo(
            user_id,
            file.originFileObj as File
          );

          if (videoUrl) {
            setCurrentVideos((prevImages) => [...prevImages, videoUrl]);
            message.success("Video uploaded successfully!");
          } else {
            throw new Error("Video upload failed.");
          }
        }
      } catch (error) {
        message.error("One or more video failed to upload.");
      }
    },
    [newVideos]
  );

  const handleSubmitChange = useCallback(async () => {
    dispatch(openLoading());
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
      message.error("User ID not found. Please log in again.");
      return;
    }

    if (newImages.length > 0) {
      await uploadImages(dataEdit.id.toString());
    }

    if (newVideos.length > 0) {
      await uploadVideos(dataEdit.id.toString());
    }

    const requestBody = {
      ...dataEdit,
      answer: editedContent,
      images: currentImages,
      videos: currentVideos,
      userid: user_id,
    };

    await postSubmitChange(dataEdit.id, requestBody)
      .then((res) => {
        message.success(res.data.message);
        dispatch(clearLoading());
        navigate(`/results/answer?id=${dataEdit.id}`);
      })
      .catch((err) => {
        message.error(`Failed to save changes: ${err.message}`);
        dispatch(clearLoading());
      });
  }, [
    dataEdit,
    editedContent,
    currentImages,
    currentVideos,
    newImages,
    newVideos,
    dispatch,
    navigate,
  ]);

  return (
    <Row
      gutter={16}
      className="h-[80vh] w-full flex flex-col justify-between items-center"
      style={{ padding: "16px" }}
    >
      {/* Search Bar */}
      <Row
        gutter={16}
        className="w-full flex justify-between items-center"
        style={{ height: "10%" }} // Allocate 10% of the 80vh
      >
        <Col span={12}>
          <Input
            size="large"
            readOnly
            value={dataEdit.question}
            className="w-full p-4 bg-[#F2F2F2] rounded-3xl border-0"
            disabled
          />
        </Col>
        <Col span={12} className="flex justify-end">
          <Button
            size="middle"
            type="primary"
            className="mr-2"
            onClick={handleSubmitChange}
          >
            Lưu chỉnh sửa
          </Button>
          <Button size="middle" onClick={() => setIsModalOpen(true)}>
            Huỷ chỉnh sửa
          </Button>
        </Col>
      </Row>

      {/* Main Content (Old and New Item Sections) */}
      <Row
        gutter={16}
        className="w-full flex justify-between"
        style={{ height: "60%" }} // Allocate 55% of the 80vh
      >
        {/* Old Item Section */}
        <Col span={12} className="p-4">
          <div className="h-full p-4 bg-[#F2F2F2] rounded-3xl">
            <p className="text-black font-semibold text-base">
              Câu trả lời hiện tại
            </p>
            <div className="h-full mt-2 overflow-hidden">
              <p className="text-black text-sm">
                {typeof dataEdit.answer === "string" ? (
                  /<\/?[a-z][\s\S]*>/i.test(dataEdit.answer) ? (
                    // Là HTML
                    <div
                      dangerouslySetInnerHTML={{ __html: dataEdit.answer }}
                    />
                  ) : (
                    // Là chuỗi văn bản
                    <p className="text-black text-sm">{dataEdit.answer}</p>
                  )
                ) : (
                  <p className="text-black text-sm">Không có dữ liệu hợp lệ</p>
                )}
              </p>
            </div>
          </div>
        </Col>

        {/* New Item Section */}
        <Col span={12} className="p-4">
          <div className="h-full p-4 border-2 border-[#BFBFBF] rounded-3xl">
            <p className="text-black font-semibold text-base">
              Câu trả lời mới
            </p>
            <div className="h-full mt-2">
              <TextEditor
                toolbarWidth="100%"
                editorHeight="100%"
                defaultValue={dataEdit.answer}
                onChange={handleEditorChange}
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* Media Section (Old and New Media) */}
      <Row
        gutter={16}
        className="w-full flex justify-between"
        style={{ height: "30%" }} // Allocate 35% of the 80vh
      >
        {/* Old Media Section */}
        <Col span={12} className="p-4">
          <div className="h-full p-4 bg-[#F5F9FF] rounded-3xl">
            <p className="text-black font-semibold text-base">
              Hình ảnh, video hiện tại
            </p>
            <div className="h-full mt-2 flex gap-2 flex-wrap overflow-hidden">
              {dataEdit.images.length === 0 && dataEdit.videos.length === 0 ? (
                <div className="text-sm">Chưa có hình ảnh, video</div>
              ) : (
                // <div className="flex gap-2 flex-wrap">
                //   {dataEdit.images.map((image, index) => (
                //     <div
                //       key={index}
                //       className="w-14 h-14 rounded-lg flex-shrink-0"
                //     >
                //       <Image
                //         src={image}
                //         alt="Image"
                //         className="w-full h-full object-cover rounded-lg"
                //       />
                //     </div>
                //   ))}
                //   {dataEdit.videos.map((video, index) => (
                //     <div
                //       key={index}
                //       className="w-14 h-14 rounded-lg flex-shrink-0"
                //     >
                //       <video
                //         src={video}
                //         className="w-full h-full object-cover rounded-lg"
                //         controls
                //       />
                //     </div>
                //   ))}
                // </div>
                <MediaPreview dataEdit={dataEdit} />
              )}
            </div>
          </div>
        </Col>

        {/* New Media Section */}
        <Col span={12} className="p-4">
          <div className="h-full p-4 bg-[#F5F9FF] rounded-3xl">
            <p className="text-black font-semibold text-base">
              Hình ảnh, video mới
            </p>
            <div className="h-full mt-2">
              <FileUpload
                onChange={(images: UploadFile[], videos: UploadFile[]) => {
                  handleFileUploadChange(images, videos);
                }}
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* Cancel Confirmation Modal */}
      <Modal
        centered
        open={isModalOpen}
        closable={false}
        footer={
          <div className="w-full flex justify-center mt-5">
            <Button
              className="mr-5"
              type="default"
              size="large"
              onClick={() => setIsModalOpen(false)}
            >
              Quay lại chỉnh sửa
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate(`/results/answer?id=${_id}`)}
            >
              Tiếp tục tìm kiếm
            </Button>
          </div>
        }
      >
        <div className="w-full flex justify-center items-center flex-col">
          <p className="text-lg text-black text-center">
            Bạn có chắc chắn muốn huỷ các thay đổi cho câu trả lời này không?
          </p>
        </div>
      </Modal>
    </Row>
  );
};

export default Edit;
