import {
  // faBookmark,
  faChevronLeft,
  faChevronRight,
  // faHeart,
  faSearch,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, message, Row } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  // getLikeAndSaveResult,
  getResultsByID,
  getTopic,
  postAddResultToTopic,
} from "../../api/api";
import { clearLoading, openLoading } from "../../redux/slices/loadingSlice";
import WarpChatAi from "./components/ChatAI/ChatContainer";
import WrapImageScreen from "./components/Image/ImageWrapper";
import WarpKeyWord from "./components/Keyword/KeywordWrapper";
import WrapVideoScreen from "./components/Media/WarpVideoScreen";
import WarpTopic from "./components/Topic/TopicWrapper";
import TextArea from "antd/es/input/TextArea";
import parse from "html-react-parser"; // Import html-react-parser
import DOMPurify from "dompurify"; // Import DOMPurify

interface DataApi {
  id: number;
  question: string;
  answer: string;
  keywords: [];
  like_count: number;
  topic: any;
  images: string[];
  videos: string[];
}

interface WarpCardProps {
  data: DataApi;
}

interface WarpCardProps2 {
  data: TopicApi[];
  topic: string;
  handleAddResultToTopic: (topic: string) => void;
}

type TopicApi = {
  id: number;
  name: string;
  question_answer_pairs: any[];
  children: TopicChild_v1[];
};

type TopicChild_v1 = {
  id: number;
  name: string;
  question_answer_pairs: any[];
  children: TopicChild_v2[];
};

type TopicChild_v2 = {
  id: number;
  name: string;
  question_answer_pairs: any[];
  children: [];
};

interface ImageWrapperProps {
  data: string[];
}

interface VideoWrapperProps {
  data: string[];
}

const normalType = {
  fontWeight: "normal",
  color: "white",
};

const boldType = {
  fontWeight: "bold",
  color: "#17B8FF",
};

const renderHtmlContent = (html: string) => {
  // Sanitize the HTML to ensure safety
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "ul", "ol", "li"],
    ALLOWED_ATTR: [],
  });
  // Parse the sanitized HTML into React components
  return parse(sanitizedHtml);
};

const Answer = () => {
  const tier = localStorage.getItem("tier");
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(setSearchParams);
  const [valueSearch, setValueSearch] = React.useState("");
  const [searchWithAI, setSearchWithAI] = React.useState(false);
  console.log("🚀 ~ Answer ~ searchWithAI:", searchWithAI);
  const [dataAnswer, setDataAnswer] = React.useState<DataApi>({
    id: 1,
    question: "",
    answer: "",
    keywords: [],
    like_count: 1,
    topic: "",
    images: [],
    videos: [],
  });

  // const [liked, setLiked] = React.useState(false);
  // const [saved, setSaved] = React.useState(true);

  const navigate = useNavigate();

  const id = searchParams.get("id");

  const [topics, setTopics] = React.useState<TopicApi[]>([]);

  const [tabs, setTabs] = React.useState("image");

  const [isOpenTabAI, setIsOpenTabAI] = React.useState(false);

  const [topicId, setTopicId] = React.useState<string>("");
  const handleAddResultToTopic = (topic: string) => {
    if (topic) {
      const requestBody = {
        question_answer_pair_id: id,
      };
      dispatch(openLoading());
      postAddResultToTopic(requestBody, topic)
        .then(() => {
          dispatch(clearLoading());
          setTopicId(topic);
          message.success("The result has been added to the topic.");
        })
        .catch((error) => {
          dispatch(clearLoading());
          console.error("Error adding result to topic:", error);
        });
    } else {
      message.error("Vui lòng chọn một topic!");
    }
  };

  const handleSearch = (searchType: string) => {
    if (searchType === "normal") {
      navigate(`/results?query=${valueSearch}`);
    } else if (searchType === "ai") {
      navigate(`/results?searchAI=true&query=${valueSearch}`);
    }
  };

  // const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter" && valueSearch !== "") {
  //     handleSearch("normal");
  //   }
  // };

  useEffect(() => {
    dispatch(openLoading());
    getTopic()
      .then((topic) => {
        setTopics(topic.data);
        dispatch(clearLoading());
      })
      .catch(() => {
        dispatch(clearLoading());
      });
  }, [dispatch]);

  useEffect(() => {
    console.log(searchParams.get("searchAI"));
    setSearchWithAI(searchParams.get("searchAI") === "true");
    const _id = searchParams.get("id");
    dispatch(openLoading());
    getResultsByID(Number(_id))
      .then((res) => {
        setValueSearch(res?.data?.question);
        setDataAnswer(res.data);
        setTopicId(res.data.topic || "");
        dispatch(clearLoading());
      })
      .catch(() => {
        dispatch(clearLoading());
      });
  }, [searchParams, dispatch]);

  const hanldeOpen = () => {
    setIsOpenTabAI(!isOpenTabAI);
  };

  // const handleClickLike = async (id: number) => {
  //   dispatch(openLoading());

  //   try {
  //     // Toggle like state on the server
  //     await postLikeCount(id.toString(), localStorage.getItem("user_id") || "");

  //     // Optimistically update UI
  //     setLiked((prevLiked) => !prevLiked);
  //     setDataAnswer((prevData) => ({
  //       ...prevData,
  //       like_count: liked ? prevData.like_count - 1 : prevData.like_count + 1,
  //     }));

  //     // Refetch status for accuracy
  //     const updatedStatus = await fetchLikeAndSaveStatus(
  //       Number(localStorage.getItem("user_id")),
  //       id
  //     );

  //     // Update state with accurate server response
  //     setLiked(updatedStatus.liked);
  //     setDataAnswer((prevData) => ({
  //       ...prevData,
  //       like_count: updatedStatus.liked
  //         ? prevData.like_count + 1
  //         : prevData.like_count - 1,
  //     }));
  //   } catch (error) {
  //     console.error("Failed to update like:", error);
  //   } finally {
  //     dispatch(clearLoading());
  //   }
  // };

  // const handleClickSave = async (id: number) => {
  //   dispatch(openLoading());

  //   try {
  //     // Toggle save state on the server
  //     await postSaveQuestion(
  //       id.toString(),
  //       localStorage.getItem("user_id") || ""
  //     );

  //     // Optimistic UI update for `save` state
  //     setSaved((prevSaved) => !prevSaved);

  //     // Refetch the like and save status to ensure accuracy
  //     const updatedStatus = await fetchLikeAndSaveStatus(
  //       Number(localStorage.getItem("user_id")),
  //       id
  //     );

  //     setLiked(updatedStatus.liked);
  //     setSaved(updatedStatus.saved);
  //   } catch (error) {
  //     console.error("Failed to update save:", error);
  //   } finally {
  //     dispatch(clearLoading());
  //   }
  // };

  // const fetchLikeAndSaveStatus = async (userId: number, questionId: number) => {
  //   try {
  //     const response = await getLikeAndSaveResult(userId, questionId);
  //     if (response && response.data) {
  //       return response.data; // { liked: boolean, saved: boolean }
  //     }
  //     throw new Error("Invalid API response");
  //   } catch (error) {
  //     console.error(
  //       `Error fetching like/save status for question ${questionId}:`,
  //       error
  //     );
  //     return { liked: false, saved: false }; // Fallback to default state
  //   }
  // };

  const WarpCard: React.FC<WarpCardProps> = ({ data }) => {
    return (
      <div className="bg-white my-5 pb-4 border shadow-lg rounded-xl">
        <div className="h-fit p-5 flex flex-col">
          {/* Header Section */}
          <Row gutter={16} className="items-center shrink-0">
            <Col span={12}>
              <h2 className="text-xl font-bold text-[#227EFF]">
                {data.question}
              </h2>
            </Col>
            <Col span={12} className="text-right">
              <Button
                type="primary"
                className="border-[#227EFF] bg-white text-[#227EFF]"
                onClick={() => navigate(`/results/answer/edit?id=${data.id}`)}
              >
                Chỉnh sửa
              </Button>
            </Col>
          </Row>

          <hr className="my-4 border-gray-300 shrink-0" />

          {/* Answer Section with scroll */}
          <div className="flex-1 max-h-full overflow-y-auto pr-2">
            {typeof data.answer === "string" ? (
              /<\/?[a-z][\s\S]*>/i.test(data.answer) ? (
                <div className="answer-content text-sm">
                  {renderHtmlContent(data.answer)}
                </div>
              ) : (
                <p className="text-sm text-black">{data.answer}</p>
              )
            ) : (
              <p className="text-sm text-black">Không có dữ liệu hợp lệ</p>
            )}
          </div>

          <hr className="mt-4 border-gray-300 shrink-0" />
        </div>
      </div>
    );
  };

  // const WarpSearch: React.FC<WarpSearchProps> = ({ onChange }) => {
  //   return (
  //     <Input
  //       size="large"
  //       placeholder="Điều bạn muốn tìm kiếm là..."
  //       className="w-full flex flex-row-reverse p-4 mt-5"
  //       prefix={
  //         <>
  //           <FontAwesomeIcon
  //             icon={faX}
  //             className="border-r border-slate-800 pr-3 color-gray"
  //           />
  //           <FontAwesomeIcon icon={faSearch} />
  //           <FontAwesomeIcon icon={faStar} onClick={onChange} />
  //         </>
  //       }
  //     />
  //   );
  // };

  const WarpImage: React.FC<ImageWrapperProps> = ({ data }) => {
    return <WrapImageScreen data={data} />;
  };

  const WarpAI: React.FC<WarpCardProps> = ({ data }) => {
    return <WarpChatAi data={data} />;
  };

  const WarpVideo: React.FC<VideoWrapperProps> = ({ data }) => {
    return <WrapVideoScreen data={data} />;
  };

  const WarpKeyword: React.FC = () => {
    if (!dataAnswer || !dataAnswer.keywords) return null; // Ensure keywords exist
    return <WarpKeyWord id={dataAnswer.id} />;
  };

  const WarpTopics: React.FC<WarpCardProps2> = ({
    data,
    topic,
    handleAddResultToTopic,
  }) => {
    return (
      <WarpTopic
        data={data}
        topic={topic}
        handleAddResultToTopic={handleAddResultToTopic}
      />
    );
  };

  return (
    <div className="h-full w-full flex justify-center items-center flex-col bg-white">
      <Row className="h-full" gutter={16}>
        <Col span={!isOpenTabAI ? 22 : 12}>
          <Row gutter={16} className="h-auto w-screen pr-10 pl-2">
            <Col className="h-full" span={12}>
              <div className="relative w-full">
                <TextArea
                  autoSize={{ minRows: 1, maxRows: 5 }} // Tự động mở rộng chiều cao
                  placeholder="Điều bạn muốn tìm kiếm là..."
                  className="w-full px-6 pt-5 pb-5 pr-16 mt-5 resize-none border border-gray-300 rounded-lg shadow-sm"
                  value={valueSearch}
                  onChange={(e) => setValueSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault(); // Chặn xuống dòng mặc định
                      if (valueSearch.trim() !== "") handleSearch("normal");
                    }
                  }}
                />
                {/* Prefix icons */}
                <div className="absolute top-12 right-4 transform -translate-y-1/2 flex items-center space-x-3">
                  <FontAwesomeIcon
                    icon={faX}
                    className={`border-r border-slate-800 pr-5 ${
                      valueSearch === ""
                        ? "text-gray-400"
                        : "cursor-pointer text-black"
                    }`}
                    onClick={() => valueSearch !== "" && setValueSearch("")}
                  />
                  <FontAwesomeIcon
                    icon={faSearch}
                    className={`pr-2 pl-3 ${
                      valueSearch !== ""
                        ? "cursor-pointer text-[#227EFF]"
                        : "text-gray-400"
                    }`}
                    onClick={() => valueSearch !== "" && handleSearch("normal")}
                  />
                  <img
                    src="/Vector.svg"
                    className={`w-5 h-5 ${
                      valueSearch !== "" ? "cursor-pointer" : "opacity-50"
                    }`}
                    onClick={() => valueSearch !== "" && handleSearch("ai")}
                  />
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={16} className="h-[80vh] w-full pl-2">
            <Col
              span={24}
              className="h-full overflow-y-auto pr-4 scrollbar-hidden"
              style={{ overflowY: "auto" }} // Fallback for ensuring scroll behavior
            >
              <WarpCard data={dataAnswer} />
            </Col>
          </Row>
        </Col>
        {!isOpenTabAI ? (
          <Col
            span={2}
            className="bg-[#1C1E26] flex justify-center items-center"
          >
            <Row
              gutter={16}
              className="flex flex-col justify-center items-center"
            >
              <Col span={6} className="mb-4">
                <div className="text-white text-2xl mb-5 w-[25px] h-[25px]">
                  <img
                    src="/Picture.svg"
                    className={"w-full h-full cursor-pointer"}
                    style={tabs === "image" ? boldType : normalType}
                    onClick={() => {
                      setTabs("image");
                      setIsOpenTabAI(true);
                    }}
                  />
                </div>
                <div
                  className="bg-[#BFBFBF] h-px w-9"
                  style={{ marginLeft: -5 }}
                ></div>
              </Col>
              <Col span={6} className="mb-4">
                <div className="text-white text-2xl w-[25px] h-[35px]">
                  <img
                    src="/Play.svg"
                    className={"w-full h-full cursor-pointer"}
                    style={tabs === "video" ? boldType : normalType}
                    onClick={() => {
                      setTabs("video");
                      setIsOpenTabAI(true);
                    }}
                  />
                </div>
              </Col>
              {tier !== "reader" ? (
                <>
                  <Col span={6} className="mb-3">
                    <div
                      className="bg-[#BFBFBF] h-px w-9 mb-5"
                      style={{ marginLeft: -5 }}
                    ></div>
                    <div className="text-white text-2xl mb-5 w-[25px] h-[25px]">
                      <img
                        src="/Vector2.svg"
                        className={"w-full h-full cursor-pointer"}
                        style={tabs === "ai" ? boldType : normalType}
                        onClick={() => {
                          setTabs("ai");
                          setIsOpenTabAI(true);
                        }}
                      />
                    </div>
                    <div
                      className="bg-[#BFBFBF] h-px w-9"
                      style={{ marginLeft: -5 }}
                    ></div>
                  </Col>
                  <Col span={6}>
                    <div className="text-white text-2xl mb-5 w-[25px] h-[35px]">
                      <img
                        src="/Edit.svg"
                        className={"w-full h-full cursor-pointer"}
                        style={tabs === "keyword" ? boldType : normalType}
                        onClick={() => {
                          setTabs("keyword");
                          setIsOpenTabAI(true);
                        }}
                      />
                    </div>
                  </Col>
                  <Col span={6}>
                    <div
                      className="bg-[#BFBFBF] h-px w-9 mb-5"
                      style={{ marginLeft: -5 }}
                    ></div>
                    <div className="text-white text-2xl w-[25px] h-[35px]">
                      <img
                        src="/Topic.svg"
                        className={"w-full h-full cursor-pointer"}
                        style={tabs === "topic" ? boldType : normalType}
                        onClick={() => {
                          setTabs("topic");
                          setIsOpenTabAI(true);
                        }}
                      />
                    </div>
                  </Col>
                </>
              ) : null}
              <div className="absolute text-black bottom-20 left-0 cursor-pointer">
                <div className="w-4 h-10 bg-[#E6E6E6] rounded-e-lg flex justify-center items-center">
                  <FontAwesomeIcon
                    icon={isOpenTabAI ? faChevronRight : faChevronLeft}
                    className="cursor-pointer"
                    onClick={hanldeOpen}
                  />
                </div>
              </div>
            </Row>
          </Col>
        ) : (
          <Col
            span={12}
            className=" bg-[#1C1E26] flex justify-center items-center"
          >
            <Row
              gutter={16}
              className="p-8 h-full w-full flex flex-col justify-start items-start"
            >
              <Row gutter={16}>
                <div className="h-10 text-white flex flex-wrap gap-x-4 items-center">
                  <div
                    className="cursor-pointer"
                    style={tabs === "image" ? boldType : normalType}
                    onClick={() => setTabs("image")}
                  >
                    Hình ảnh
                  </div>
                  <div>|</div>
                  <div
                    className="cursor-pointer"
                    style={tabs === "video" ? boldType : normalType}
                    onClick={() => setTabs("video")}
                  >
                    Video
                  </div>
                  {tier !== "reader" && (
                    <>
                      <div>|</div>
                      <div
                        className="cursor-pointer"
                        style={tabs === "ai" ? boldType : normalType}
                        onClick={() => setTabs("ai")}
                      >
                        Trả lời với AI
                      </div>
                      <div>|</div>
                      <div
                        className="cursor-pointer"
                        style={tabs === "keyword" ? boldType : normalType}
                        onClick={() => setTabs("keyword")}
                      >
                        Thêm Keyword
                      </div>
                      <div>|</div>
                      <div
                        className="cursor-pointer"
                        style={tabs === "topic" ? boldType : normalType}
                        onClick={() => setTabs("topic")}
                      >
                        Topic
                      </div>
                    </>
                  )}
                </div>
              </Row>
              <Row gutter={16} className="w-full my-3">
                {tabs === "image" ? (
                  <WarpImage data={dataAnswer.images} />
                ) : tabs === "video" ? (
                  <WarpVideo data={dataAnswer.videos} />
                ) : tabs === "ai" ? (
                  <WarpAI data={dataAnswer} />
                ) : tabs === "keyword" ? (
                  <WarpKeyword />
                ) : (
                  <WarpTopics
                    data={topics}
                    topic={topicId}
                    handleAddResultToTopic={handleAddResultToTopic}
                  />
                )}
              </Row>
            </Row>
            <div className="absolute text-black bottom-20 left-0 cursor-pointer">
              <div className="w-4 h-10 bg-[#E6E6E6] rounded-e-lg flex justify-center items-center">
                <FontAwesomeIcon
                  icon={isOpenTabAI ? faChevronRight : faChevronLeft}
                  onClick={hanldeOpen}
                />
              </div>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Answer;
