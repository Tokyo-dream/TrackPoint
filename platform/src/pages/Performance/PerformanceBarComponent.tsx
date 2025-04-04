import React from "react";
import ReactECharts from "echarts-for-react";

interface PerformanceBarProps {
  title: string;
  data: number[];
  markLineValue: number;
  markLineLabel: string;
  max: number;
}

const PerformanceBar: React.FC<PerformanceBarProps> = ({
  title,
  data,
  markLineValue,
  markLineLabel,
  max,
}) => {
  const colors = ["#4CAF50", "#FFC107", "#F44336"];
  const labelNames = ["Good", "Needs Improvement", "Poor"];

  const cumulativeData = data.reduce(
    (acc, cur, index) => {
      acc.push(acc[index] + cur);
      return acc;
    },
    [0] as number[]
  );

  const option = {
    title: {
      text: title,
      left: "left",
      textStyle: { fontSize: 16, fontWeight: "bold" },
    },
    xAxis: {
      type: "value",
      max: max,
      splitLine: { show: false },
      axisLabel: {
        customValues: cumulativeData,
        color: "#000",
      },
    },
    yAxis: { type: "category", show: false },
    series: [
      ...data.map((value, index) => ({
        type: "bar",
        stack: "x",
        data: [value],
        itemStyle: { color: colors[index] },
        label: {
          show: true,
          formatter: () => `${labelNames[index]}`,
          color: "#000",
          fontSize: 10,
        },
      })),
      {
        type: "line",
        markLine: {
          silent: true,
          symbol: ["none", "triangle"],
          symbolRotate: 180,
          symbolOffset: [0, -0.6],
          symbolSize: 8,
          label: { show: true, formatter: markLineLabel, fontSize: 14 },
          lineStyle: { color: "#000000", type: "solid", width: 1 },
          // emphasis: { disabled: true },
          data: [{ xAxis: markLineValue }],
        },
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ width: "100%", height: 180 }} />
  );
};

export default PerformanceBar;
