import {
  // faBookmark,
  faChevronLeft,
  faChevronRight,
  // faHeart,
  faSearch,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Input, Row } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  // getLikeAndSaveResult,
  getResultsByID,
  getTopic,
} from "../../api/api";
import { clearLoading, openLoading } from "../../redux/slices/loadingSlice";
import WarpChatAi from "./components/ChatAI/ChatContainer";
import WrapImageScreen from "./components/Image/ImageWrapper";
import WarpKeyWord from "./components/Keyword/KeywordWrapper";
import WrapVideoScreen from "./components/Media/WarpVideoScreen";
import WarpTopic from "./components/Topic/TopicWrapper";

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
  const [topics, setTopics] = React.useState<TopicApi[]>([]);

  const [tabs, setTabs] = React.useState("image");

  const [isOpenTabAI, setIsOpenTabAI] = React.useState(false);

  const handleSearch = (searchType: string) => {
    if (searchType === "normal") {
      navigate(`/results?query=${valueSearch}`);
    } else if (searchType === "ai") {
      navigate(`/results?searchAI=true&query=${valueSearch}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && valueSearch !== "") {
      handleSearch("normal");
    }
  };

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
        console.log("🚀 ~ getResultsByID ~ res:", res);
        setValueSearch(res?.data?.question);
        setDataAnswer(res.data);
        dispatch(clearLoading());
      })
      .catch((err) => {
        console.log("🚀 ~ getResultsByID ~ err:", err);
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
      <div className="bg-white mt-4 pb-4 border shadow-lg rounded-xl">
        <div className="p-5">
          {/* Header Section */}
          <Row gutter={16} className="items-center">
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

          <hr className="my-4 border-gray-300" />

          {/* Answer Section with scroll */}
          <div className="max-h-80 overflow-y-auto pr-2">
            {typeof data.answer === "string" ? (
              /<\/?[a-z][\s\S]*>/i.test(data.answer) ? (
                <div
                  className="prose max-w-full"
                  dangerouslySetInnerHTML={{ __html: data.answer }}
                />
              ) : (
                <p className="text-sm text-black">{data.answer}</p>
              )
            ) : (
              <p className="text-sm text-black">Không có dữ liệu hợp lệ</p>
            )}
          </div>
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

  const WarpTopics: React.FC<WarpCardProps2> = ({ data, topic }) => {
    return <WarpTopic data={data} topicSelected={topic} />;
  };

  return (
    <div className="h-full w-full flex justify-center items-center flex-col bg-white">
      <Row className="h-full" gutter={16}>
        <Col span={!isOpenTabAI ? 22 : 12}>
          <Row gutter={16} className="h-auto w-screen pr-10 pl-2">
            <Col className="h-full" span={12}>
              {/* <WarpSearch onChange={() => setSearchWithAI(!searchWithAI)} /> */}
              <Input
                size="large"
                placeholder="Điều bạn muốn tìm kiếm là..."
                className="w-full h-16 flex flex-row-reverse px-6 mt-5"
                value={valueSearch}
                onChange={(e) => setValueSearch(e.target.value)}
                onKeyDown={handleKeyPress}
                prefix={
                  <>
                    <FontAwesomeIcon
                      icon={faX}
                      className={`border-r border-slate-800 pr-5 ${
                        valueSearch === "" ? "color-gray" : "cursor-pointer"
                      }`}
                      color="inherit"
                      onClick={() => valueSearch !== "" && setValueSearch("")}
                    />
                    <FontAwesomeIcon
                      icon={faSearch}
                      className={`pr-2 pl-3 ${
                        valueSearch !== "" ? "cursor-pointer" : ""
                      }`}
                      color="#227EFF"
                      onClick={() =>
                        valueSearch !== "" && handleSearch("normal")
                      }
                    />
                    {/* <FontAwesomeIcon
                      icon={faStar}
                      className={`pl-2 ${
                        valueSearch !== "" ? "cursor-pointer" : ""
                      }`}
                      color={valueSearch === "" ? "gray" : "#227EFF"}
                      onClick={() => valueSearch !== "" && handleSearch("ai")}
                    /> */}
                    <img
                      src="/Vector.svg"
                      className={`w-5 h-5 ${
                        valueSearch !== "" ? "cursor-pointer" : ""
                      }`}
                      onClick={() => valueSearch !== "" && handleSearch("ai")}
                    />
                  </>
                }
              />
            </Col>
          </Row>
          <Row gutter={16} className="h-fit w-full flex overflow-hide pl-2">
            <Col span={24}>
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
                    <div className="text-white text-2xl w-[25px] h-[35px]">
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
              className="p-8 h-full w-full flex flex-coll justify-start items-start"
            >
              <Col span={24}>
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
              </Col>
              <Col span={24} className="h-[70vh] w-full">
                {tabs === "image" ? (
                  <WarpImage data={dataAnswer.images} />
                ) : tabs === "video" ? (
                  <WarpVideo data={dataAnswer.videos} />
                ) : tabs === "ai" ? (
                  <WarpAI data={dataAnswer} />
                ) : tabs === "keyword" ? (
                  <WarpKeyword />
                ) : (
                  <WarpTopics data={topics} topic={dataAnswer.topic} />
                )}
              </Col>
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
