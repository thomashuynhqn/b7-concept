import React from "react";
import { PieChart, Pie, Cell } from "recharts";

interface CustomPieChartProps {
  newUser: number;
  oldUser: number;
}

const COLORS = ["#595959", "#000000"];

const CustomPieChart: React.FC<CustomPieChartProps> = ({
  newUser,
  oldUser,
}) => {
  // Define the static data here
  const data = [
    { name: "New User", value: newUser },
    { name: "Old User", value: oldUser },
  ];

  return (
    <div className="flex justify-center items-center h-full w-full">
      <PieChart width={260} height={260}>
        <Pie
          data={data}
          cx="auto"
          cy="auto"
          innerRadius={80}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
};

export default CustomPieChart;
