import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Footer } from "../components/Footer";
import {
  INCOME_HISTORY_1_YEAR,
  INCOME_HISTORY_5_YEARS,
  INCOME_HISTORY_ALL_TIME,
} from "../data/mockData";

type TimeFrame = "1-year" | "5-years" | "all-time";

const TIME_FRAME_OPTIONS: { value: TimeFrame; label: string }[] = [
  { value: "1-year", label: "1 Year" },
  { value: "5-years", label: "5 Years" },
  { value: "all-time", label: "All Time" },
];

function getChartData(timeFrame: TimeFrame) {
  switch (timeFrame) {
    case "5-years":
      return INCOME_HISTORY_5_YEARS;
    case "all-time":
      return INCOME_HISTORY_ALL_TIME;
    default:
      return INCOME_HISTORY_1_YEAR;
  }
}

function getYAxisConfig(timeFrame: TimeFrame) {
  if (timeFrame === "1-year") {
    return { domain: [0, 40000] as [number, number], ticks: [0, 5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000] };
  }
  if (timeFrame === "5-years") {
    return { domain: [0, 350000] as [number, number], ticks: [0, 50000, 100000, 150000, 200000, 250000, 300000, 350000] };
  }
  return { domain: [0, 350000] as [number, number], ticks: [0, 50000, 100000, 150000, 200000, 250000, 300000, 350000] };
}

interface IncomeHistoryPageProps {
  isDarkMode?: boolean;
}

export function IncomeHistoryPage({ isDarkMode = false }: IncomeHistoryPageProps) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("1-year");

  const primaryColor = isDarkMode ? "#DF2A57" : "#C70039";
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#555555";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#666666";

  const chartData = getChartData(timeFrame);
  const yAxis = getYAxisConfig(timeFrame);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        background: isDarkMode ? "#1A1C21" : "#F4F5F7",
      }}
    >
      <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: primaryColor, margin: 0 }}>Income History</h1>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "6px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            flex: 1,
            minHeight: "500px",
          }}
        >
          <div>
            <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: mutedColor }}>
              Select a time frame for the report
            </p>
            <div style={{ display: "flex", gap: "20px" }}>
              {TIME_FRAME_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: textColor,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="timeFrame"
                    checked={timeFrame === opt.value}
                    onChange={() => setTimeFrame(opt.value)}
                    style={{ accentColor: primaryColor }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ width: "100%", flex: 1, minHeight: "420px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#333" : "#E5E7EB"} />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11, fill: mutedColor }}
                  axisLine={{ stroke: borderColor }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: mutedColor }}
                  axisLine={{ stroke: borderColor }}
                  tickLine={false}
                  domain={yAxis.domain}
                  ticks={yAxis.ticks}
                />
                <Tooltip
                  contentStyle={{
                    background: cardBg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="center"
                  iconType="square"
                  wrapperStyle={{ paddingBottom: "16px", fontSize: "13px" }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke={primaryColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke="#999999"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
