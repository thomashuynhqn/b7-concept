// src/pages/ResultsContainer.tsx

import React, { useEffect, useState } from "react";
import { Button, Modal, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

import Result from "./pages/Result";
import ResultAI from "./pages/ResultAi";
import SaveModal from "../../utils/SharedComponents/SaveModal/SaveModal";
import {
  getResults,
  getResultsAI,
  // getLikeAndSaveResult,
  postLikeCount,
  postSaveQuestion,
} from "../../api/api";
import { openLoading, clearLoading } from "../../redux/slices/loadingSlice";
import { DataApi } from "./types/data";

const ResultsContainer: React.FC = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Shared state
  const [isSearchWithAI, setIsSearchWithAI] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isModalSaveDone, setIsModalSaveDone] = useState(false);
  const [isModalSaveError, setIsModalSaveError] = useState(false);
  const [results, setResults] = useState<DataApi[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [likes, setLikes] = useState<{ [key: number]: boolean }>({});
  const [saved, setSaved] = useState<{ [key: number]: boolean }>({});
  const [searchValue, setSearchValue] = useState<string>("");
  const [aiData, setAIData] = useState("");
  const [answerId, setAnswerId] = useState<number>(0);

  const searchTerm = searchParams.get("query");
  const searchAIParam = searchParams.get("searchAI");

  // Whenever the URL parameter changes, update the mode.
  useEffect(() => {
    setIsSearchWithAI(searchAIParam === "true");
  }, [searchAIParam]);

  // Refactored handleSearch to separate normal from AI search.
  const handleSearch = async (searchType: "normal" | "ai") => {
    setSearchParams({
      query: searchValue,
      searchAI: searchType === "ai" ? "true" : "false",
    });
    dispatch(openLoading());
    setLoading(true);
    if (searchType === "normal") {
      try {
        const { data } = await getResults(searchValue);
        setResults(data.questions);
        setIsSearchWithAI(false);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
        dispatch(clearLoading());
      }
    } else if (searchType === "ai") {
      try {
        // In AI mode, call both APIs concurrently.
        const [normalRes, aiRes] = await Promise.all([
          getResults(searchValue),
          getResultsAI(searchValue),
        ]);
        setResults(normalRes.data.questions);
        setAIData(aiRes.data.ai_answer);
        setAnswerId(aiRes.data.answer_id);
        setIsSearchWithAI(true);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
        dispatch(clearLoading());
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue) {
      handleSearch("normal");
    }
  };

  const handleClickLike = async (id: number) => {
    dispatch(openLoading());
    try {
      await postLikeCount(id.toString(), localStorage.getItem("user_id") || "");
      setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
      setResults((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                like_count: likes[id]
                  ? item.like_count - 1
                  : item.like_count + 1,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Failed to update like:", err);
    } finally {
      dispatch(clearLoading());
    }
  };

  const handleClickSave = async (id: number) => {
    dispatch(openLoading());
    try {
      await postSaveQuestion(
        id.toString(),
        localStorage.getItem("user_id") || ""
      );
      setSaved((prev) => ({ ...prev, [id]: !prev[id] }));
    } catch (err) {
      console.error("Failed to update save:", err);
    } finally {
      dispatch(clearLoading());
    }
  };

  const handleOpenSaveModal = () => {
    setIsSaveModalOpen(true);
  };

  // const fetchLikeAndSaveStatus = async (userId: number, questionId: number) => {
  //   try {
  //     const response = await getLikeAndSaveResult(userId, questionId);
  //     if (response && response.data) return response.data;
  //     throw new Error("Invalid API response");
  //   } catch (error) {
  //     console.error(
  //       `Error fetching like/save status for question ${questionId}:`,
  //       error
  //     );
  //     return { liked: false, saved: false };
  //   }
  // };

  // Update data when the URL search term changes.
  useEffect(() => {
    const fetchResultsData = async () => {
      if (searchTerm && searchTerm.length > 0) {
        setLoading(true);
        dispatch(openLoading());
        try {
          if (searchAIParam === "true") {
            // For AI search, run both APIs concurrently.
            const [normalRes, aiRes] = await Promise.all([
              getResults(searchTerm),
              getResultsAI(searchTerm),
            ]);
            setResults(normalRes.data.questions);
            setAIData(aiRes.data.ai_answer);
            setAnswerId(aiRes.data.answer_id);
            setIsSearchWithAI(true);
          } else {
            const { data } = await getResults(searchTerm);
            setResults(data.questions);
            // Optionally, fetch like/save statuses here...
            setIsSearchWithAI(false);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
          dispatch(clearLoading());
        }
      }
    };
    fetchResultsData();
  }, [searchTerm, searchAIParam, dispatch]);

  useEffect(() => {
    if (searchTerm) {
      setSearchValue(searchTerm);
    }
  }, [searchTerm]);

  // Centralized loading state (children handle their own minimal loading if needed)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[90vh]">
        <Spin tip="Loading results..." size="large" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Modals */}
      <Modal
        centered
        open={isModalSaveDone}
        footer={
          <div className="w-full flex justify-center mt-6">
            <Button
              onClick={() => setIsModalSaveDone(false)}
              type="primary"
              size="large"
            >
              Tiếp tục tìm kiếm
            </Button>
          </div>
        }
        closable={false}
      >
        <div className="flex flex-col items-center space-y-4 p-4">
          <FontAwesomeIcon icon={faCheck} className="text-5xl text-blue-600" />
          <p className="text-3xl text-black">Lưu thành công</p>
          <p className="text-sm text-gray-600 text-center max-w-md">
            Thay đổi của bạn đang được chúng tôi xử lý. Theo dõi tiến trình tại
            “Tài khoản &gt; Tiến trình xử lý”.
          </p>
        </div>
      </Modal>

      <Modal
        centered
        open={isModalSaveError}
        footer={
          <div className="w-full flex justify-around mt-6">
            <Button
              onClick={() => {
                setIsSaveModalOpen(true);
                setIsModalSaveError(false);
              }}
              type="default"
              className="w-1/2"
              size="large"
            >
              Quay lại chỉnh sửa
            </Button>
            <Button
              onClick={() => setIsModalSaveError(false)}
              type="primary"
              className="w-1/2"
              size="large"
            >
              Tiếp tục tìm kiếm
            </Button>
          </div>
        }
        closable={false}
      >
        <div className="flex flex-col items-center space-y-4 p-4">
          <FontAwesomeIcon icon={faX} className="text-5xl text-red-500" />
          <p className="text-3xl text-black">Lưu không thành công!</p>
          <p className="text-sm text-gray-600 text-center max-w-md">
            Thông tin chỉnh sửa của bạn có thể đang thiếu hoặc sai. Vui lòng cập
            nhật thêm.
          </p>
        </div>
      </Modal>

      <SaveModal
        visible={isSaveModalOpen}
        question={searchValue}
        answer={aiData}
        onCancel={() => {
          setIsModalSaveError(true);
          setIsSaveModalOpen(false);
        }}
        onSave={() => {
          // Process the updated data (e.g., send change request to admin)
          setIsModalSaveDone(true);
          setIsSaveModalOpen(false);
        }}
      />

      {/* Results Section */}
      {isSearchWithAI ? (
        <div className="grid grid-cols-2 gap-6 h-[90vh]">
          <Result
            results={results}
            likes={likes}
            saved={saved}
            onClickLike={handleClickLike}
            onClickSave={handleClickSave}
            loading={loading} // required prop
            error={error} // required prop
            isSearchWithAI={isSearchWithAI} // required prop
            searchValue={searchValue}
            onSearchValueChange={setSearchValue}
            onKeyPress={handleKeyPress}
            onSearchNormal={() => searchValue && handleSearch("normal")}
            onSearchAI={() => searchValue && handleSearch("ai")}
          />
          <ResultAI
            aiData={aiData}
            answerId={answerId}
            onClose={() => setIsSearchWithAI(false)}
            onSaveAnswer={() => handleOpenSaveModal()}
          />
        </div>
      ) : (
        <Result
          results={results}
          likes={likes}
          saved={saved}
          onClickLike={handleClickLike}
          onClickSave={handleClickSave}
          loading={loading} // required prop
          error={error} // required prop
          isSearchWithAI={isSearchWithAI} // required prop
          searchValue={searchValue}
          onSearchValueChange={setSearchValue}
          onKeyPress={handleKeyPress}
          onSearchNormal={() => searchValue && handleSearch("normal")}
          onSearchAI={() => searchValue && handleSearch("ai")}
        />
      )}
    </div>
  );
};

export default ResultsContainer;
