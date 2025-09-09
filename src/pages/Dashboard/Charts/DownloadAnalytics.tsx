import React from "react";
import Chart from "react-apexcharts";

const DownloadAnalytics: React.FC = () => {
  const chartOptions = {
    chart: {
      id: "downloads-chart",
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      title: { text: "Month" }
    },
    yaxis: {
      title: { text: "Downloads" }
    },
    colors: ["#4f46e5"],
    stroke: { curve: "smooth", width: 3 } as const,
    dataLabels: { enabled: false },
    grid: { borderColor: "#e5e7eb" }
  };

  const chartSeries = [
    {
      name: "Downloads",
      data: [120, 200, 150, 300, 250, 400, 500, 450, 600, 550, 700, 800]
    }
  ];

  return (
    <div className="w-">
      <h2 className="text-lg font-semibold mb-3">Download Analytics</h2>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="line"
        height={350}
      />
    </div>
  );
};

export default DownloadAnalytics;
