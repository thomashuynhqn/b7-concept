import {
  faArrowDownShortWide,
  faArrowUpShortWide,
  faChevronDown,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePicker } from "antd";
import CustomLineChart from "./components/LineChartWidget";
import CustomPieChart from "./components/PieChartWidget";

const { RangePicker } = DatePicker;

const DashboardScreen = () => {
  const totalPrice = [
    { name: "JAN", uv: 1900000 },
    { name: "FEB", uv: 2300000 },
    { name: "MAR", uv: 1100000 },
    { name: "APR", uv: 3800000 },
    { name: "MAY", uv: 2200000 },
    { name: "JUN", uv: 7850000 },
    { name: "JUL", uv: 3780000 },
    { name: "AUG", uv: 5120000 },
    { name: "SEP", uv: 1890000 },
    { name: "OCT", uv: 2900000 },
    { name: "NOV", uv: 2100000 },
    { name: "DEC", uv: 2420000 },
  ];

  const totalMembers = [
    { name: "JAN", uv: 510 },
    { name: "FEB", uv: 260 },
    { name: "MAR", uv: 620 },
    { name: "APR", uv: 480 },
    { name: "MAY", uv: 1110 },
    { name: "JUN", uv: 1897 },
    { name: "JUL", uv: 1250 },
    { name: "AUG", uv: 1499 },
    { name: "SEP", uv: 400 },
    { name: "OCT", uv: 635 },
    { name: "NOV", uv: 344 },
    { name: "DEC", uv: 570 },
  ];

  // Define custom Y-axis tick data
  const incomeYAxisTicks = [0, 2000000, 4000000, 6000000, 8000000];
  const membersYAxisTicks = [0, 500, 1000, 1500, 2000]; // Custom ticks for total members

  // Define tick formatters
  const formatIncomeTicks = (value: number) =>
    value === 0 ? "0" : `${value / 1000000} triệu`;
  const formatMemberTicks = (value: number) => value.toString(); // Simple formatter without "triệu"

  return (
    <div className="h-full flex flex-col">
      {/* Name page */}
      <div className="flex mb-10">
        <p className="mr-32 text-[#000000] font-bold text-3xl">Bảng thống kê</p>
        <RangePicker className="px-7 rounded-xl border-[#BFBFBF]" />
      </div>

      {/* data and pie charts */}
      <div className="flex h-1/3 justify-around">
        <div className="w-1/4 flex flex-col justify-between">
          <div className="w-full h-[45%] flex items-center justify-around rounded-2xl bg-white">
            <div>
              <p className="mb-4">Thu nhập</p>
              <p className="text-4xl font-bold">49.450.00</p>
            </div>
            <div>
              <FontAwesomeIcon icon={faArrowUpShortWide} className="mb-4" />
              <p className="text-end mt-4">vnd</p>
            </div>
          </div>
          <div className="w-full h-[45%] flex justify-around items-center rounded-2xl bg-white">
            <div>
              <p className="mb-4">Hoàn tiền</p>
              <p className="text-4xl font-bold">1.200.000</p>
            </div>
            <div>
              <FontAwesomeIcon icon={faArrowDownShortWide} className="mb-4" />
              <p className="text-end mt-4">vnd</p>
            </div>
          </div>
        </div>

        <div className="w-[37%] mx-5 bg-white flex p-5 rounded-2xl">
          <div className="w-2/5 flex flex-col justify-between">
            <div className="mt-2">
              <p>Số thành viên</p>
              <p className="text-4xl font-bold mt-4">6.359</p>
            </div>
            <div>
              <p>
                <FontAwesomeIcon
                  icon={faSquare}
                  className="text-[#595959] mr-2"
                />{" "}
                <b>1.590</b> đăng ký mới
              </p>
              <p>
                <FontAwesomeIcon
                  icon={faSquare}
                  className="text-[#000000] mr-2"
                />{" "}
                <b>4.769</b> đã đăng ký
              </p>
            </div>
          </div>
          <div className="w-3/5">
            <CustomPieChart newUser={1590} oldUser={4769} />
          </div>
        </div>

        <div className="w-[37%] bg-white flex p-5 rounded-2xl">
          <div className="w-2/5 flex flex-col justify-between">
            <div className="mt-2">
              <p>Số thành viên</p>
              <p className="text-4xl font-bold mt-4">24.510</p>
            </div>
            <div>
              <p>
                <FontAwesomeIcon
                  icon={faSquare}
                  className="text-[#595959] mr-2"
                />{" "}
                <b>9.804</b> câu hỏi mới
              </p>
              <p>
                <FontAwesomeIcon
                  icon={faSquare}
                  className="text-[#000000] mr-2"
                />{" "}
                <b>14.706</b> câu hỏi đã có
              </p>
            </div>
          </div>
          <div className="w-3/5">
            <CustomPieChart newUser={9804} oldUser={14706} />
          </div>
        </div>
      </div>

      {/* column chart */}
      <div className="h-[48%] flex flex-row justify-between mt-10">
        <div className="bg-white w-[49%] rounded-2xl flex flex-col p-10">
          <div className="flex justify-between mb-8">
            <p className="font-bold text-lg">Tổng thu nhập</p>
            <p className="font-bold text-lg">
              2023 <FontAwesomeIcon icon={faChevronDown} />
            </p>
          </div>
          <CustomLineChart
            dataNumber={totalPrice}
            yAxisTicks={incomeYAxisTicks}
            tickFormatter={formatIncomeTicks}
          />
        </div>
        <div className="bg-white w-[49%] rounded-2xl flex flex-col p-10">
          <div className="flex justify-between mb-8">
            <p className="font-bold text-lg">Tổng thành viên đăng ký</p>
            <p className="font-bold text-lg">
              2023 <FontAwesomeIcon icon={faChevronDown} />
            </p>
          </div>
          <CustomLineChart
            dataNumber={totalMembers}
            yAxisTicks={membersYAxisTicks}
            tickFormatter={formatMemberTicks}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
