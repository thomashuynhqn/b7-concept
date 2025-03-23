import { Input } from "antd";
import { Search, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { TextArea } = Input;

const SearchComponent: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const [timeOfDay, setTimeOfDay] = useState<string>("");
  const navigate = useNavigate();

  const getTimeOfDay = (): string => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return "buổi sáng";
    if (hours >= 12 && hours < 17) return "buổi trưa";
    if (hours >= 17 && hours < 20) return "buổi chiều";
    return "buổi tối";
  };

  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
  }, []);

  const handleSearch = (searchType: string) => {
    if (value.trim() === "") return;

    const formattedQuery = encodeURIComponent(value.trim());

    const query = `?query=${formattedQuery}`;
    const aiQuery = `?searchAI=true&query=${formattedQuery}`;

    navigate(
      searchType === "normal" ? `/results${query}` : `/results${aiQuery}`
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch("normal");
    }
  };

  useEffect(() => {
    const userID = localStorage.getItem("user_id");
    if (!userID) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
      {/* Welcome message */}
      <div className="text-center">
        <motion.p
          className="text-[#227EFF] text-4xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Xin chào <span>{timeOfDay}</span>, Mình là QAL!
        </motion.p>
        <motion.p
          className="text-black text-4xl font-bold mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          Mình có thể giúp gì cho bạn?
        </motion.p>
      </div>

      {/* Search bar */}
      <div className="relative w-full max-w-2xl mt-8">
        <TextArea
          placeholder="Điều bạn muốn tìm kiếm là..."
          className="h-16 pt-4 px-5 pr-24 rounded-lg shadow-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#227EFF] resize-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyPress}
          autoSize={{ minRows: 2, maxRows: 5 }}
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
          {/* Clear input icon */}
          <X
            className={`cursor-pointer ${
              value === "" ? "text-gray-400 pointer-events-none" : "text-black"
            }`}
            onClick={() => value !== "" && setValue("")}
          />
          {/* Search icon */}
          <Search
            className={`cursor-pointer ${
              value === ""
                ? "text-[#227EFF] pointer-events-none opacity-30"
                : "text-[#227EFF] opacity-100"
            }`}
            onClick={() => handleSearch("normal")}
          />
          {/* AI Search icon */}
          <Sparkles
            className={`cursor-pointer ${
              value === ""
                ? "text-[#227EFF] pointer-events-none opacity-30"
                : "text-[#227EFF] opacity-100"
            }`}
            onClick={() => handleSearch("ai")}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
