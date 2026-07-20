"use client";

import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface SalesChartProps {
  data: { date: string; total: number }[];
}

export default function SalesChart({ data }: SalesChartProps) {
  const options: any = {
    chart: {
      id: "sales-trend",
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: false },
    },
    colors: ["#2D6A4F"],
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100]
      }
    },
    xaxis: {
      categories: data.map(d => d.date),
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { formatter: (val: number) => `₹${val.toFixed(0)}` }
    },
    grid: { borderColor: "#f1f1f1" },
    tooltip: { theme: "light" },
    markers: { size: 4, colors: ["#2D6A4F"], strokeColors: "#fff", strokeWidth: 2 }
  };

  const series = [{
    name: "Revenue",
    data: data.map(d => d.total)
  }];

  return (
    <div className="bg-white rounded-lg p-3">
      <Chart options={options} series={series} type="area" height={280} />
    </div>
  );
}
