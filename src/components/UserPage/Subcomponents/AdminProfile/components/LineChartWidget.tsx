import React from "react";
import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

// Define the type for the data items
interface CustomLineChartProps {
  dataNumber: { name: string; uv: number }[];
  yAxisTicks: number[]; // New prop for custom Y-axis ticks
  tickFormatter?: (value: number) => string; // Optional prop for custom tick formatting
}

const CustomLineChart: React.FC<CustomLineChartProps> = ({
  dataNumber,
  yAxisTicks,
  tickFormatter,
}) => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <LineChart width={710} height={300} data={dataNumber}>
        <XAxis
          dataKey="name"
          padding={{ left: 30, right: 30 }}
          axisLine={false} // Hide the X-axis line
          tickLine={false} // Hide the tick lines on the X-axis
        />
        <YAxis
          ticks={yAxisTicks} // Set numeric tick values
          tickFormatter={tickFormatter} // Use custom tickFormatter if provided
          axisLine={false}
          tickLine={false}
        />
        <Tooltip />
        <Line type="monotone" dataKey="uv" stroke="#000000" dot={false} />
      </LineChart>
    </div>
  );
};

export default CustomLineChart;
