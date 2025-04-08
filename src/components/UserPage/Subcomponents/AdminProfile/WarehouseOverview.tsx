import {
  faCaretDown,
  faCaretRight,
  faEllipsis,
  faPlus,
  faSearch,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input, Menu, MenuProps, Modal, Popover } from "antd";
import React from "react";
import AddTopic from "./components/AddTopicWidget";

// const fakeData: Topic[] = [
//   {
//     id: 1,
//     name: "Chủ đề 01",
//     totalSubTopics: 3,
//     subTopics: [
//       {
//         id: 1,
//         name: "Chủ đề 1.1",
//         totalQuestions: 3,
//         questions: [
//           { id: 11, text: "Làm thế nào để tự học tốt hơn?" },
//           { id: 22, text: "Phương pháp tự học hiệu quả" },
//           { id: 33, text: "Tự học có khó không?" },
//         ],
//       },
//       {
//         id: 2,
//         name: "Chủ đề 1.2",
//         totalQuestions: 2,
//         questions: [
//           { id: 12, text: "Học HTML như nào?" },
//           { id: 23, text: "Học CSS ở đâu?" },
//         ],
//       },
//       {
//         id: 3,
//         name: "Chủ đề 1.3",
//         totalQuestions: 5,
//         questions: [
//           { id: 13, text: "Học JavaScript như nào?" },
//           { id: 24, text: "Học JavaScript ở đâu?" },
//           { id: 34, text: "Học TypeScript như nào?" },
//           { id: 41, text: "Học TypeScript ở đâu?" },
//           { id: 51, text: "Học Front-End ở đâu?" },
//         ],
//       },
//     ],
//   },
//   {
//     id: 2,
//     name: "Chủ đề 02",
//     totalSubTopics: 1,
//     subTopics: [
//       {
//         id: 1,
//         name: "Chủ đề 2.1",
//         totalQuestions: 1,
//         questions: [{ id: 14, text: "Lộ trình để trở thành Developer" }],
//       },
//     ],
//   },
//   {
//     id: 3,
//     name: "Chủ đề 03",
//     totalSubTopics: 5,
//     subTopics: [
//       {
//         id: 1,
//         name: "Chủ đề 3.1",
//         totalQuestions: 1,
//         questions: [{ id: 15, text: "Học NodeJS ở đâu?" }],
//       },
//       {
//         id: 2,
//         name: "Chủ đề 3.2",
//         totalQuestions: 1,
//         questions: [{ id: 16, text: "Học NodeJS như nào?" }],
//       },
//       {
//         id: 3,
//         name: "Chủ đề 3.3",
//         totalQuestions: 1,
//         questions: [{ id: 17, text: "Học NextJS ở đâu?" }],
//       },
//       {
//         id: 4,
//         name: "Chủ đề 3.3",
//         totalQuestions: 1,
//         questions: [{ id: 18, text: "Học NextJS ở đâu?" }],
//       },
//       {
//         id: 5,
//         name: "Chủ đề 3.4",
//         totalQuestions: 1,
//         questions: [
//           { id: 19, text: "Làm sao để trở thành Back-End Developer?" },
//         ],
//       },
//     ],
//   },
//   {
//     id: 4,
//     name: "Chủ đề 04",
//     totalSubTopics: 3,
//     subTopics: [
//       {
//         id: 1,
//         name: "Chủ đề 4.1",
//         totalQuestions: 1,
//         questions: [{ id: 100, text: "Master JSX?" }],
//       },
//       {
//         id: 2,
//         name: "Chủ đề 4.2",
//         totalQuestions: 1,
//         questions: [{ id: 101, text: "Master TSX?" }],
//       },
//       {
//         id: 3,
//         name: "Chủ đề 4.3",
//         totalQuestions: 1,
//         questions: [{ id: 102, text: "Master FE?" }],
//       },
//     ],
//   },
//   {
//     id: 5,
//     name: "Chủ đề 05",
//     totalSubTopics: 2,
//     subTopics: [
//       {
//         id: 1,
//         name: "Chủ đề 5.1",
//         totalQuestions: 1,
//         questions: [{ id: 103, text: "Mobile App là gì?" }],
//       },
//       {
//         id: 2,
//         name: "Chủ đề 5.2",
//         totalQuestions: 1,
//         questions: [{ id: 104, text: "Lộ trình để trở thành 1 Mobile App?" }],
//       },
//     ],
//   },
//   {
//     id: 6,
//     name: "Chủ đề 06",
//     totalSubTopics: 2,
//     subTopics: [
//       {
//         id: 1,
//         name: "Chủ đề 6.1",
//         totalQuestions: 1,
//         questions: [{ id: 105, text: "Làm sao để giỏi hơn?" }],
//       },
//       {
//         id: 2,
//         name: "Chủ đề 6.2",
//         totalQuestions: 1,
//         questions: [{ id: 107, text: "Làm sao để tốt hơn?" }],
//       },
//     ],
//   },
//   {
//     id: 7,
//     name: "Chủ đề 07",
//     totalSubTopics: 5,
//     subTopics: [
//       {
//         id: 1,
//         name: "Chủ đề 7.1",
//         totalQuestions: 1,
//         questions: [{ id: 109, text: "Full stack Developer?" }],
//       },
//       {
//         id: 2,
//         name: "Chủ đề 7.2",
//         totalQuestions: 1,
//         questions: [{ id: 121, text: "Làm sao để làm Full stack?" }],
//       },
//       {
//         id: 3,
//         name: "Chủ đề 7.3",
//         totalQuestions: 1,
//         questions: [{ id: 122, text: "Lương của Developer?" }],
//       },
//       {
//         id: 4,
//         name: "Chủ đề 7.4",
//         totalQuestions: 1,
//         questions: [{ id: 123, text: "Nghèo thì làm gì?" }],
//       },
//       {
//         id: 5,
//         name: "Chủ đề 7.5",
//         totalQuestions: 1,
//         questions: [{ id: 125, text: "Giàu thì làm sao?" }],
//       },
//     ],
//   },
// ];

type MenuItem = Required<MenuProps>["items"][number];

type Question = {
  id: number;
  text: string;
};

type SubTopic = {
  id: number;
  name: string;
  question_answer_pairs: Question[];
  children: SubTopic[];
};

type Topic = {
  id: number;
  name: string;
  question_answer_pairs: Question[];
  children: SubTopic[];
};

interface WarpCardProps {
  data: Topic;
}

interface WarpWareHouseProps {
  data: Topic[];
}

const WarpCard: React.FC<WarpCardProps> = ({ data }) => {
  const [openKeys, setOpenKeys] = React.useState<string[]>([]);
  const [openPopovers, setOpenPopovers] = React.useState<
    Record<string, boolean>
  >({});
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys); // Update open keys
  };

  const handlePopoverOpenChange = (id: string, isOpen: boolean) => {
    setOpenPopovers((prev) => ({ ...prev, [id]: isOpen }));
  };

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };

  const menuItems: MenuItem[] = [
    {
      key: `topic-${data.id}`, // Unique key for each topic
      label: (
        <span className="font-bold text-lg">
          {data.name}{" "}
          <span className="text-[#595959] text-sm border border-[#595959] rounded-2xl px-2 py-1 ml-52 font-extralight">
            Tổng số câu hỏi ({data.children.length})
          </span>{" "}
          {/* Display totalSubTopics */}
        </span>
      ),
      icon: openKeys.includes(`topic-${data.id}`) ? (
        <FontAwesomeIcon icon={faCaretDown} />
      ) : (
        <FontAwesomeIcon icon={faCaretRight} />
      ), // Toggle between icons based on the open state
      children: data.children.map((subTopic) => ({
        key: `subTopic-${subTopic.id}`, // Unique key for each subtopic
        label: (
          <span className="font-bold">
            {subTopic.name}{" "}
            <span className="text-[#595959] text-sm border border-[#595959] rounded-2xl px-2 py-1 ml-52 font-extralight">
              Tổng số câu hỏi ({subTopic.children.length})
            </span>{" "}
            {/* Display totalQuestions */}
          </span>
        ),
        icon: openKeys.includes(`subTopic-${subTopic.id}`) ? (
          <FontAwesomeIcon icon={faCaretDown} />
        ) : (
          <FontAwesomeIcon icon={faCaretRight} />
        ), // Toggle between icons based on the open state
        children: subTopic.children.map((question) => ({
          key: `question-${question.id}`,
          label: (
            <div className="flex justify-between items-center">
              {question.name}
              <Popover
                overlayInnerStyle={{
                  backgroundColor: "#F5F9FF",
                  borderRadius: 16,
                }}
                style={{ boxShadow: "6px 4px 4px #000000" }}
                placement="bottomLeft"
                content={
                  <div className="flex flex-col p-3 bg-[#F5F9FF] rounded-2xl gap-2">
                    <p className="cursor-pointer" onClick={showModal}>
                      Di chuyển
                    </p>
                    <p
                      className="border-b border-[#808080] pb-3 cursor-pointer"
                      onClick={() => handleOpenChange([])}
                    >
                      Chỉnh sửa
                    </p>
                    <p className="text-right cursor-pointer">Xoá</p>
                  </div>
                }
                trigger="click"
                open={openPopovers[`question-${question.id}`] || false}
                onOpenChange={(isOpen) =>
                  handlePopoverOpenChange(`question-${question.id}`, isOpen)
                }
              >
                <FontAwesomeIcon icon={faEllipsis} />
              </Popover>
            </div>
          ),
        })),
      })),
    },
  ];

  return (
    <div className="w-full h-auto overflow-auto">
      <Menu
        onClick={onClick}
        style={{ width: "100%", border: "none" }}
        mode="inline"
        items={menuItems}
        openKeys={openKeys} // Use the state to control which keys are open
        onOpenChange={handleOpenChange} // Handle open state changes
        expandIcon={
          <Popover
            overlayInnerStyle={{ backgroundColor: "#F5F9FF", borderRadius: 16 }}
            style={{ boxShadow: "6px 4px 4px #000000" }}
            placement="bottomLeft"
            content={
              <div className="flex flex-col p-3 bg-[#F5F9FF] rounded-2xl gap-2">
                <p className="cursor-pointer">Di chuyển</p>
                <Modal
                  centered
                  open={isModalOpen}
                  footer={false}
                  closable={false}
                  keyboard={false}
                  width="55%"
                  height="auto"
                >
                  <div className="h-full mt-4 mx-4">
                    {/* title */}
                    <div className="flex flex-row justify-between items-center mb-5">
                      <p className="font-bold text-xl">
                        Di chuyển Topic này đến...
                      </p>
                      <Input
                        className="w-2/5 p-2 flex flex-row-reverse"
                        style={{ borderRadius: 10 }}
                        prefix={
                          <>
                            <FontAwesomeIcon
                              icon={faX}
                              className="border-r border-slate-800 pr-5"
                            />
                            <FontAwesomeIcon
                              icon={faSearch}
                              className="pr-2 pl-3"
                            />
                          </>
                        }
                        placeholder="Tìm topic nhanh"
                      />
                    </div>
                    {/* contain */}
                    <div className="h-96 border rounded-3xl p-4">
                      <Menu
                        onClick={onClick}
                        style={{ width: "100%", border: "none" }}
                        mode="inline"
                        items={menuItems} // Use the menu items you already defined
                        openKeys={openKeys} // Use the state to control which keys are open
                        onOpenChange={handleOpenChange} // Handle open state changes
                      />
                    </div>
                    {/* footer */}
                    <div className="flex items-center justify-between mt-10">
                      <p className="text-[#808080] text-sm underline">
                        Tạo thư mục mới
                      </p>
                      <div>
                        <Button
                          size="large"
                          onClick={() => setIsModalOpen(!isModalOpen)}
                        >
                          Huỷ
                        </Button>
                        <Button
                          type="primary"
                          className="ml-10 border-0"
                          size="large"
                        >
                          Di chuyển
                        </Button>
                      </div>
                    </div>
                  </div>
                </Modal>
                <p
                  className="border-b border-[#808080] pb-3 cursor-pointer"
                  onClick={() => handleOpenChange([])}
                >
                  Chỉnh sửa
                </p>
                <p className="text-right cursor-pointer">Xoá</p>
              </div>
            }
            trigger="click"
          >
            <FontAwesomeIcon icon={faEllipsis} />
          </Popover>
        }
      />
    </div>
  );
};

const WarehouseScreen: React.FC<WarpWareHouseProps> = ({ data }) => {
  const boxShadow = {
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const [addTopic, setAddTopic] = React.useState(false);

  return (
    <>
      {addTopic === false ? (
        <div className="h-full flex flex-col mt-[-15px]">
          {/* Title screen */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-[#000000] font-bold text-3xl">Kho dữ liệu</p>
            <div className="flex w-3/5 justify-end">
              <Input
                className="w-1/2 p-5 flex flex-row-reverse"
                style={{ borderRadius: 26, ...boxShadow }}
                size="large"
                placeholder="Tìm kiếm người dùng..."
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
                className="ml-10 flex items-center w-fit h-auto border-none whitespace-nowrap px-4 py-2"
                style={{
                  borderRadius: 16,
                  backgroundColor: "#FF7600",
                  color: "white",
                }}
                size="large"
                onClick={() => setAddTopic(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-4" />
                Thêm topic mới
              </Button>
            </div>
          </div>

          {/* Topic screen */}
          <div className="w-full h-5/6 bg-white rounded-2xl p-5">
            <div className="overflow-auto h-[75dvh]">
              {data.map((topic) => (
                <WarpCard key={topic.id} data={topic} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          {/* Title screen */}
          <div className="flex justify-between items-center mb-11">
            <p className="text-[#000000] font-bold text-3xl">Tạo chủ đề mới</p>
            <Button onClick={() => setAddTopic(false)}> Quay lại</Button>
          </div>
          <div className="w-full h-full">
            <AddTopic setAddTopic={setAddTopic} />
          </div>
        </div>
      )}
    </>
  );
};

export default WarehouseScreen;
