import {
  faEllipsis,
  faPlus,
  faSearch,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input, Menu, MenuProps, Popover, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearLoading, openLoading } from "../../redux/slices/loadingSlice";
import {
  getTopic,
  postAddNewTopic,
  postDeleteTopic,
  postMoveTopic,
  postRenameTopic,
} from "../../api/api";

const { Option } = Select;

type MenuItem = Required<MenuProps>["items"][number];

type TopicApi = {
  id: number;
  name: string;
  question_answer_pairs: any[];
  children: TopicApi[];
};

interface WarpCardProps {
  data: TopicApi;
  onDeleteTopic: (id: number) => void;
  onChangeTopicName: (id: number, newName: string) => void;
  onDeleteSubTopic: (topicId: number, subTopicId: number) => void;
  onChangeSubTopicName: (
    topicId: number,
    subTopicId: number,
    newName: string
  ) => void;
  onDragStart: (subTopic: TopicApi, sourceTopicId: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (targetTopicId: number) => void;
}

const WarpCard: React.FC<WarpCardProps> = ({
  data,
  onDeleteTopic,
  onChangeTopicName,
  onDeleteSubTopic,
  onChangeSubTopicName,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [openKeys, setOpenKeys] = React.useState<string[]>([]);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTopicName, setNewTopicName] = useState<string>("");
  const [editSubTopicId, setEditSubTopicId] = useState<number | null>(null);
  const [newSubTopicName, setNewSubTopicName] = useState<string>("");
  const [editTopic, setEditTopic] = useState<number | null>(null);

  const [isQuestionModalOpen, setIsQuestionModalOpen] =
    useState<boolean>(false);
  const [selectedQA, setSelectedQA] = useState<TopicApi | null>(null);

  const handleOpenQuestionModal = (qaPairs: TopicApi) => {
    setSelectedQA(qaPairs);
    setIsQuestionModalOpen(true);
  };

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const openEditTopicModal = (topic: TopicApi) => {
    setNewTopicName(topic.name);
    setIsModalOpen(true);
    setEditTopic(topic.id);
    setEditSubTopicId(null);
  };

  const openEditSubTopicModal = (subTopic: TopicApi) => {
    setNewSubTopicName(subTopic.name);
    setIsModalOpen(true);
    setEditSubTopicId(subTopic.id);
    setEditTopic(null);
  };

  const handleSaveTopicName = () => {
    if (editTopic !== null && newTopicName !== "") {
      dispatch(openLoading());
      postRenameTopic(editTopic.toString(), newTopicName)
        .then(() => {
          dispatch(clearLoading());
          onChangeTopicName(editTopic, newTopicName);
          setIsModalOpen(false);
          setEditTopic(null);
        })
        .catch(() => {
          dispatch(clearLoading());
        });
    }
  };

  const handleSaveSubTopicName = () => {
    if (editSubTopicId !== null && newSubTopicName !== "") {
      dispatch(openLoading());

      postRenameTopic(editSubTopicId.toString(), newSubTopicName)
        .then(() => {
          // const updatedSubTopics = data.children.map((subTopic) => {
          //   if (subTopic.id === editSubTopicId) {
          //     return { ...subTopic, name: newSubTopicName };
          //   }
          //   return subTopic;
          // });

          // onChangeSubTopicName(data.id, editSubTopicId, newSubTopicName);

          // data.children = updatedSubTopics;

          dispatch(clearLoading());
          onChangeSubTopicName(data.id, editSubTopicId, newSubTopicName);
          setIsModalOpen(false);
          setEditSubTopicId(null);
        })
        .catch(() => {
          dispatch(clearLoading());
        });
    }
  };

  const toggleOpen = () => {
    if (openKeys.includes(`topic-${data.id}`)) {
      setOpenKeys(openKeys.filter((key) => key !== `topic-${data.id}`));
    } else {
      setOpenKeys([...openKeys, `topic-${data.id}`]);
    }
  };

  const menuItems: MenuItem[] = [
    {
      key: `topic-${data.id}`,
      label: (
        <div
          className="flex justify-between items-center"
          draggable
          onDragStart={() => onDragStart(data, data.id)}
          onDragOver={onDragOver}
          onDrop={() => onDrop(data.id)}
        >
          <span
            className="font-bold text-lg cursor-pointer"
            onClick={toggleOpen}
          >
            <div
              className="flex justify-between items-center w-full cursor-pointer hover:text-blue-700"
              draggable
              onClick={(e) => {
                e.stopPropagation();
                handleOpenQuestionModal(data);
              }}
            >
              {data.name}
            </div>
          </span>
          <Popover
            content={
              <div>
                <p
                  className="cursor-pointer"
                  onClick={() => openEditTopicModal(data)}
                >
                  Đổi tên chủ đề
                </p>
                <p
                  className="cursor-pointer text-red-500"
                  onClick={() => onDeleteTopic(data.id)}
                >
                  Xoá chủ đề
                </p>
              </div>
            }
            trigger="click"
          >
            <FontAwesomeIcon
              icon={faEllipsis}
              className="p-3 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
          </Popover>
        </div>
      ),
      children: data.children.map((subTopic) => ({
        key: `subTopic-${subTopic.id}`,
        label: (
          <div
            className="flex justify-between items-center w-full"
            draggable
            onDragStart={() => onDragStart(subTopic, subTopic.id)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(subTopic.id)}
          >
            <div
              className="flex justify-between items-center w-full cursor-pointer hover:text-blue-700"
              draggable
              onClick={(e) => {
                e.stopPropagation();
                handleOpenQuestionModal(subTopic);
              }}
            >
              <span className="font-bold truncate max-w-[70%]">
                {subTopic.name}
              </span>
            </div>
            <div className="flex items-center space-x-2 min-w-[200px] justify-end">
              <span className="text-[#595959] text-sm border border-[#595959] rounded-2xl px-2 py-1 font-extralight">
                Tổng số câu hỏi ({subTopic.children.length})
              </span>

              <Popover
                content={
                  <div>
                    <p
                      className="cursor-pointer"
                      onClick={() => openEditSubTopicModal(subTopic)}
                    >
                      Đổi tên subtopic
                    </p>
                    <p
                      className="cursor-pointer text-red-500"
                      onClick={() => onDeleteSubTopic(data.id, subTopic.id)}
                    >
                      Xoá subtopic
                    </p>
                  </div>
                }
                trigger="click"
              >
                <FontAwesomeIcon
                  icon={faEllipsis}
                  className="p-3 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                />
              </Popover>
            </div>
          </div>
        ),
        children: subTopic.children.map((child) => ({
          key: `question-${child.id}`,
          label: (
            <div
              className="flex justify-between items-center w-full"
              draggable
              onDragStart={() => onDragStart(child, child.id)}
              onDragOver={onDragOver}
              onDrop={() => onDrop(child.id)}
            >
              <div
                className="flex justify-between items-center w-full cursor-pointer hover:text-blue-700"
                draggable
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenQuestionModal(child);
                }}
              >
                <span className="font-bold truncate max-w-[70%]">
                  {child.name}
                </span>
              </div>
              <div className="flex items-center space-x-2 min-w-[200px] justify-end">
                <span className="text-[#595959] text-sm border border-[#595959] rounded-2xl px-2 py-1 font-extralight">
                  Tổng số câu hỏi ({child.children.length})
                </span>

                <Popover
                  content={
                    <div>
                      <p
                        className="cursor-pointer"
                        onClick={() => openEditSubTopicModal(child)}
                      >
                        Đổi tên subtopic
                      </p>
                      <p
                        className="cursor-pointer text-red-500"
                        onClick={() => onDeleteSubTopic(subTopic.id, child.id)}
                      >
                        Xoá subtopic
                      </p>
                    </div>
                  }
                  trigger="click"
                >
                  <FontAwesomeIcon
                    icon={faEllipsis}
                    className="p-3 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                </Popover>
              </div>
            </div>
          ),
        })),
      })),
    },
  ];

  return (
    <div className="w-full h-auto overflow-auto border border-[#BFBFBF] rounded-3xl py-2 mb-4">
      <Menu
        style={{ width: "100%", border: "none" }}
        items={menuItems}
        openKeys={openKeys}
        mode="inline"
        onOpenChange={handleOpenChange}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              {editSubTopicId !== null ? "Rename Subtopic" : "Rename Topic"}
            </h2>
            <input
              className="w-full p-3 border rounded-lg mb-4 text-lg bg-white"
              type="text"
              placeholder={
                editSubTopicId !== null
                  ? "New subtopic name..."
                  : "New topic name..."
              }
              value={editSubTopicId !== null ? newSubTopicName : newTopicName}
              onChange={(e) =>
                editSubTopicId !== null
                  ? setNewSubTopicName(e.target.value)
                  : setNewTopicName(e.target.value)
              }
            />
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-all"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditSubTopicId(null);
                  setEditTopic(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                onClick={
                  editSubTopicId !== null
                    ? handleSaveSubTopicName
                    : handleSaveTopicName
                }
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isQuestionModalOpen && selectedQA && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              {selectedQA.name}
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedQA.question_answer_pairs.map((qa, index) => (
                <div key={index} className="p-3 border rounded-lg bg-gray-100">
                  <p className="font-semibold text-lg">{qa.question}</p>
                  <div className="text-gray-700">
                    {qa.answer && /<\/?[a-z][\s\S]*>/i.test(qa.answer) ? (
                      <div dangerouslySetInnerHTML={{ __html: qa.answer }} />
                    ) : (
                      <p className="text-black text-sm">{qa.answer}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-all"
                onClick={() => setIsQuestionModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TopicManage: React.FC = () => {
  const dispatch = useDispatch();
  const [valueSearch, setValueSearch] = useState<string>("");
  const [topics, setTopics] = useState<TopicApi[]>([]);
  const [subTopics, setSubTopics] = useState<TopicApi[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState("");

  // Dropdown state for selecting parent topic
  const [selectedParentTopicId, setSelectedParentTopicId] = useState<
    number | null
  >(null);
  const [subSelectTopicId, setSubSelectTopicId] = useState<number | null>(null);

  const [draggedSubTopic, setDraggedSubTopic] = useState<TopicApi | null>(null);
  const [sourceTopicId, setSourceTopicId] = useState<number | null>(null);

  useEffect(() => {
    fetchTopics();
  }, [dispatch]);

  const fetchTopics = () => {
    dispatch(openLoading());
    getTopic()
      .then((topic) => {
        setTopics(topic.data);
        dispatch(clearLoading());
      })
      .catch(() => {
        dispatch(clearLoading());
      });
  };

  const handleDelete = (
    id: number
    // isSubTopic: boolean,
    // parentTopicId?: number
  ) => {
    dispatch(openLoading());

    postDeleteTopic(id)
      .then(() => {
        // If deleting a subtopic, update the corresponding topic's children
        // if (isSubTopic && parentTopicId) {
        //   const updatedTopics = topics.map((topic) => {
        //     if (topic.id === parentTopicId) {
        //       return {
        //         ...topic,
        //         children: topic.children.filter(
        //           (subTopic) => subTopic.id !== id
        //         ),
        //       };
        //     }
        //     return topic;
        //   });
        //   setTopics(updatedTopics);
        // } else {
        //   // If deleting a topic, filter it out from the main topics list
        //   setTopics(topics.filter((topic) => topic.id !== id));
        // }

        fetchTopics();
        dispatch(clearLoading());
      })
      .catch((e) => {
        dispatch(clearLoading());
        console.log(e);
      });
  };

  const handleDeleteTopic = (id: number) => {
    handleDelete(id);
  };

  const handleDeleteSubTopic = (subTopicId: number) => {
    handleDelete(subTopicId);
  };

  const handleCreateNewTopic = () => {
    if (!newTopicName.trim()) {
      setErrorMessage("Topic name is required.");
      return;
    } else {
      dispatch(openLoading());

      let mId = "";

      if (subSelectTopicId !== null) {
        mId = subSelectTopicId !== null ? subSelectTopicId.toString() : "";
      } else {
        mId =
          selectedParentTopicId !== null
            ? selectedParentTopicId.toString()
            : "";
      }
      // const parentTopicId =
      //   selectedParentTopicId !== null ? selectedParentTopicId.toString() : "";

      postAddNewTopic(newTopicName, mId)
        .then((response) => {
          const newTopic: TopicApi = {
            id: response.data.id,
            name: newTopicName,
            question_answer_pairs: [],
            children: [],
          };

          let updatedTopics;

          if (selectedParentTopicId) {
            updatedTopics = topics.map((topic) => {
              if (topic.id === selectedParentTopicId) {
                return {
                  ...topic,
                  children: [...topic.children, newTopic],
                };
              }
              return topic;
            });
          } else {
            updatedTopics = [...topics, newTopic];
          }

          setTopics(updatedTopics);

          getTopic()
            .then((refetchedTopics) => {
              setTopics(refetchedTopics.data);
            })
            .catch((e) => {
              console.log(e);
            })
            .finally(() => {
              dispatch(clearLoading());
              setNewTopicName("");
              setSelectedParentTopicId(null);
              setIsModalOpen(false);
            });
        })
        .catch((e) => {
          dispatch(clearLoading());
          console.log(e);
        });
    }
  };

  const handleMoveSubTopic = (newParentId: number | null) => {
    if (draggedSubTopic && sourceTopicId !== null) {
      dispatch(openLoading());

      // Ensure resolvedParentId is valid or fallback to sourceTopicId if it's null
      const resolvedParentId =
        newParentId !== null ? newParentId : sourceTopicId;

      postMoveTopic(draggedSubTopic.id.toString(), resolvedParentId)
        .then(() => {
          // let updatedTopics = topics.map((topic) => {
          //   if (topic.id === sourceTopicId) {
          //     return {
          //       ...topic,
          //       children: topic.children.filter(
          //         (subTopic) => subTopic.id !== draggedSubTopic.id
          //       ),
          //     };
          //   }
          //   if (topic.id === resolvedParentId) {
          //     return {
          //       ...topic,
          //       children: [...topic.children, draggedSubTopic],
          //     };
          //   }
          //   return topic;
          // });

          // setTopics(updatedTopics);
          dispatch(clearLoading());
          fetchTopics();
        })
        .catch((e) => {
          dispatch(clearLoading());
          console.log(e);
        });
    }
  };

  const handleDragStart = (subTopic: TopicApi, sourceTopicId: number) => {
    setDraggedSubTopic(subTopic);
    setSourceTopicId(sourceTopicId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (targetTopicId: number) => {
    handleMoveSubTopic(targetTopicId);
    setDraggedSubTopic(null);
    setSourceTopicId(null);
  };

  const handleParentTopicChange = (value: number | null) => {
    setSelectedParentTopicId(value);
    setSubTopics(topics.find((topic) => topic.id === value)?.children || []);
  };

  const handleSubTopicChange = (value: number | null) => {
    setSubSelectTopicId(value);
  };

  return (
    <div className="h-full flex flex-col mt-5">
      <div className="flex justify-between items-center mb-4">
        <p className="text-[#000000] font-bold text-3xl">Quản lý Topic</p>
        <div className="flex w-3/5 justify-end">
          <Input
            className="w-1/2 p-5 flex flex-row-reverse"
            style={{ borderRadius: 26 }}
            size="large"
            placeholder="Tìm kiếm topic..."
            value={valueSearch}
            onChange={(e) => setValueSearch(e.target.value)}
            prefix={
              <>
                <FontAwesomeIcon
                  icon={faX}
                  className="border-r border-slate-800 pr-5"
                />
                <FontAwesomeIcon icon={faSearch} className="pr-2 pl-3" />
              </>
            }
          />
          <Button
            className="ml-10 flex items-center w-1/6 h-auto border-none"
            style={{
              borderRadius: 16,
              backgroundColor: "#FF7600",
              color: "white",
            }}
            size="large"
            onClick={() => setIsModalOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Thêm topic mới
          </Button>
        </div>
      </div>
      <div className="w-full bg-white rounded-2xl py-4">
        <div className="overflow-auto]">
          {topics.map((topic) => (
            <WarpCard
              key={topic.id}
              data={topic}
              onDeleteTopic={handleDeleteTopic}
              onChangeTopicName={fetchTopics}
              onDeleteSubTopic={handleDeleteSubTopic}
              onChangeSubTopicName={fetchTopics}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>
      {draggedSubTopic !== null && (
        <div
          className="h-full bg-gray-200 border-dashed border-2 border-gray-400 rounded-lg flex items-center justify-center"
          onDragOver={handleDragOver}
          onDrop={(e) => {
            e.preventDefault();
            handleMoveSubTopic(0);
            setDraggedSubTopic(null);
            setSourceTopicId(null);
          }}
        >
          <p>Di chuyển vào đây để thành topic tổng</p>
        </div>
      )}
      {/* Modal Popup for Adding Topic */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Add New Topic</h2>
            <input
              className="w-full p-3 border rounded-lg mb-4 bg-white"
              type="text"
              placeholder="Enter new topic name"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
            />
            {errorMessage && ( // Hiển thị thông báo lỗi nếu có
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}
            {/* Dropdown to select parent topic */}
            <Select
              className="w-full mb-4"
              placeholder="Select parent topic (optional)"
              value={selectedParentTopicId}
              onChange={handleParentTopicChange}
              allowClear
            >
              <Option value={null}>None</Option>
              {topics.map((topic) => (
                <Option key={topic.id} value={topic.id}>
                  {topic.name}
                </Option>
              ))}
            </Select>

            <Select
              className="w-full mb-4"
              placeholder="Select parent topic (optional)"
              value={subSelectTopicId}
              onChange={handleSubTopicChange}
              allowClear
            >
              <Option value={null}>None</Option>
              {subTopics.map((topic) => (
                <Option key={topic.id} value={topic.id}>
                  {topic.name}
                </Option>
              ))}
            </Select>

            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              onClick={handleCreateNewTopic}
            >
              Add Topic
            </button>
            <button
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicManage;
