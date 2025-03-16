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
  topic: Topic | string;
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
  console.log("🚀 ~ Edit ~ dataEdit:", dataEdit);

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
        // Kiểm tra kích thước file trước khi upload
        for (const file of newImages) {
          if ((file.originFileObj as File).size > 15 * 1024 * 1024) {
            message.error(`Image ${file.name} exceeds 15MB limit.`);
            throw new Error("Image size exceeds limit."); // Dừng tiến trình
          }
        }

        const uploadedUrls = await Promise.all(
          newImages.map(async (file) => {
            const imageUrl = await postUpLoadImage(
              id,
              file.originFileObj as File
            );
            if (!imageUrl) throw new Error("Image upload failed.");
            return imageUrl;
          })
        );

        setCurrentImages((prevImages) => [...prevImages, ...uploadedUrls]);
        message.success("All images uploaded successfully!");
      } catch (error) {
        message.error("One or more images failed to upload.");
      }
    },
    [newImages]
  );

  const uploadVideos = useCallback(
    async (id: string) => {
      try {
        for (const file of newVideos) {
          if ((file.originFileObj as File).size > 15 * 1024 * 1024) {
            message.error(`Video ${file.name} exceeds 15MB limit.`);
            throw new Error("Video size exceeds limit."); // Dừng tiến trình
          }
        }

        const uploadedUrls = await Promise.all(
          newVideos.map(async (file) => {
            const videoUrl = await postUploadVideo(
              id,
              file.originFileObj as File
            );
            if (!videoUrl) throw new Error("Video upload failed.");
            return videoUrl;
          })
        );

        setCurrentVideos((prevVideos) => [...prevVideos, ...uploadedUrls]);
        message.success("All videos uploaded successfully!");
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

    try {
      if (newImages.length > 0) {
        await uploadImages(dataEdit.id.toString()); // Nếu lỗi thì dừng
      }

      if (newVideos.length > 0) {
        await uploadVideos(dataEdit.id.toString()); // Nếu lỗi thì dừng
      }

      const requestBody = {
        ...dataEdit,
        answer: editedContent,
        images: currentImages,
        videos: currentVideos,
        userid: user_id,
      };

      const res = await postSubmitChange(dataEdit.id, requestBody);
      message.success(res.data.message);
      navigate(`/results/answer?id=${dataEdit.id}`);
    } catch (err) {
      message.error(`Failed to process request: ${err}`);
    } finally {
      dispatch(clearLoading());
    }
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
        style={{ height: "10%" }}
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
        style={{ height: "60%" }}
      >
        {/* Old Item Section */}
        <Col span={12} className="p-4">
          <div className="p-4 bg-[#F2F2F2] rounded-3xl">
            <p className="text-black font-semibold text-base">
              Câu trả lời hiện tại
            </p>
            {/* Set a max height so overflow triggers scrolling */}
            <div
              className="mt-2 overflow-y-auto"
              style={{ maxHeight: "300px" }}
            >
              {typeof dataEdit.answer === "string" ? (
                /<\/?[a-z][\s\S]*>/i.test(dataEdit.answer) ? (
                  <div dangerouslySetInnerHTML={{ __html: dataEdit.answer }} />
                ) : (
                  <p className="text-black text-sm">{dataEdit.answer}</p>
                )
              ) : (
                <p className="text-black text-sm">Không có dữ liệu hợp lệ</p>
              )}
            </div>
          </div>
        </Col>

        {/* New Item Section */}
        <Col span={12} className="p-4">
          <div className="p-4 border-2 border-[#BFBFBF] rounded-3xl">
            <p className="text-black font-semibold text-base">
              Câu trả lời mới
            </p>
            {/* Same fixed max-height for scroll */}
            <div
              className="mt-2 overflow-y-auto"
              style={{ maxHeight: "300px" }}
            >
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
        style={{ height: "30%" }}
      >
        {/* Old Media Section */}
        <Col span={12} className="p-4">
          <div className="h-full p-4 bg-[#F5F9FF] rounded-3xl">
            <p className="text-black font-semibold text-base">
              Hình ảnh, video hiện tại
            </p>
            <div className="h-full mt-2 flex gap-2 flex-wrap overflow-hidden">
              {dataEdit?.images?.length === 0 &&
              dataEdit?.videos?.length === 0 ? (
                <div className="text-sm">Chưa có hình ảnh, video</div>
              ) : (
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
