// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const data = [
//   { month: "Jan", booksRead: 4 },
//   { month: "Feb", booksRead: 3 },
//   { month: "Mar", booksRead: 5 },
//   { month: "Apr", booksRead: 2 },
//   { month: "May", booksRead: 6 },
//   { month: "Jun", booksRead: 4 },
// ];

// const ReadAnalytics = () => {
//   return (
//     <div>

//       {/* Chart */}
//       <div className="bg-gray-800 p-4 rounded-lg">
//         <h4 className="text-white text-center mb-3">Reading Progress Chart</h4>
//         <div className="h-64">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={data}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
//               <XAxis dataKey="month" stroke="#fff" />
//               <YAxis stroke="#fff" />
//               <Tooltip />
//               <Bar dataKey="booksRead" fill="#38bdf8" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>



//     </div>
//   );
// };
// export default ReadAnalytics;

import React from "react";
import ReactEcharts from "echarts-for-react";

const ReadingPerformance: React.FC = () => {
  const value = 65;

  const option = {
    tooltip: {
      formatter: '{a} <br/>{c}%'
    },
    series: [
      {
        name: 'Reading Performance',
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 5,
        axisLine: {
          lineStyle: {
            width: 30,
            color: [
              [0.2, '#9f0712'],   // 0-20 Red
              [0.4, '#f97316'],   // 20-40 Orange
              [0.6, '#e60076'],   // 40-60 Pink
              [0.8, '#193cb8'],   // 60-80 Blue
              [1, '#016630']      // 80-100 Green
            ]
          }
        },
        pointer: {
          length: '75%',
          width: 4
        },
        axisTick: {
          distance: -45,
          length: 8,
          lineStyle: { color: '#000', width: 2 }
        },
        splitLine: {
          distance: -52,
          length: 20,
          lineStyle: { color: '#000', width: 2 }
        },
        axisLabel: {
          color: '#000',
          distance: -10,
          fontSize: 12
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: '#000',
          fontSize: 24,
          offsetCenter: [0, '30%']
        },
        data: [{ value }]
      }
    ]
  };

  return (
    <div className="">
  {/* Left Legend */}


  {/* Gauge Chart */}
<div className="">
  <ReactEcharts
    option={option}
    style={{ width: "400px" }}
    className="mb-4"
  />
  <div className="flex flex-col gap-2 text-sm items-start">
    <LegendItem color="bg-red-800" label="Between 0-20" desc="Poor" />
    <LegendItem color="bg-orange-500" label="Between 20-40" desc="Needs Improvement" />
    <LegendItem color="bg-pink-600" label="Between 40-60" desc="Average Reader" />
    <LegendItem color="bg-blue-800" label="Between 60-80" desc="Good Reader" />
    <LegendItem color="bg-green-800" label="Between 80-100" desc="Exceptional Reader" />
  </div>
</div>

</div>

  );
};

interface LegendItemProps {
  color: string;
  label: string;
  desc: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ color, label, desc }) => (
  <div className="flex items-center gap-2">
    <div className={`w-5 h-5 ${color} rounded`}></div>
    <span className="font-medium">{label}</span>
    <span className="text-gray-500"> {desc}</span>
  </div>
);

export default ReadingPerformance;
