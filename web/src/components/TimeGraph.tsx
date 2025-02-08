"use client";

import type React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";

interface DataPoint {
  id: number;
  adId: number;
  adSpaceId: number;
  requestedAt: string;
}

const TimeSeriesGraph: React.FC<{ data: DataPoint[] }> = ({ data }) => {
  // Group data by date and count occurrences
  const aggregatedData = data.reduce((acc: { [key: string]: number }, item) => {
    const date = format(parseISO(item.requestedAt), "MMM dd");
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Convert to array format for recharts
  const formattedData = Object.entries(aggregatedData).map(([date, count]) => ({
    date,
    views: count,
  }));

  // Sort by date
  formattedData.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={formattedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="date" stroke="#94a3b8" />
        <YAxis
          stroke="#94a3b8"
          allowDecimals={false}
          label={{
            value: "Views",
            angle: -90,
            position: "insideLeft",
            style: { fill: "#94a3b8" },
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid #475569",
            borderRadius: "6px",
          }}
          labelStyle={{ color: "#94a3b8" }}
        />
        <Area
          type="monotone"
          dataKey="views"
          stroke="#06b6d4"
          fill="#06b6d4"
          fillOpacity={0.2}
          strokeWidth={2}
          dot={true}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TimeSeriesGraph;
