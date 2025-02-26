import { Input } from "antd";
import { Search, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SearchComponent: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const [timeOfDay, setTimeOfDay] = useState<string>(""); // State to track the time of day
  const navigate = useNavigate();

  // Function to determine the time of day
  const getTimeOfDay = (): string => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return "buổi sáng"; // Morning
    if (hours >= 12 && hours < 17) return "buổi trưa"; // Noon
    if (hours >= 17 && hours < 20) return "buổi chiều"; // Evening
    return "buổi tối"; // Night
  };

  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
  }, []);

  const handleSearch = (searchType: string) => {
    if (value.trim() === "") return;

    const query = `?query=${value}`;
    const aiQuery = `?searchAI=true&query=${value}`;

    navigate(
      searchType === "normal" ? `/results${query}` : `/results${aiQuery}`
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
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
      <div className="relative w-full max-w-2xl mt-8 ">
        <Input
          size="large"
          placeholder="Điều bạn muốn tìm kiếm là..."
          className="h-16 px-5 pr-24 rounded-lg shadow-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#227EFF] cursor-p"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyPress}
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
