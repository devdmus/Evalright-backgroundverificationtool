import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SALES_CHART_DATA } from "../data/mockData";

interface ClientSalesTabProps {
  isDarkMode?: boolean;
}

export function ClientSalesTab({ isDarkMode = false }: ClientSalesTabProps) {
  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#333333";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#6B7280";

  return (
    <div
      style={{
        background: cardBg,
        border: `1px solid ${borderColor}`,
        borderRadius: "6px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        padding: "24px 20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <span
          style={{
            display: "inline-block",
            width: "24px",
            height: "3px",
            background: "#F5A623",
            borderRadius: "2px",
          }}
        />
        <span style={{ fontSize: "13px", color: textColor, fontWeight: 500 }}>Last 12 Months</span>
      </div>

      <div style={{ width: "100%", height: "360px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={SALES_CHART_DATA} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F5A623" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#F5A623" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#333" : "#E5E7EB"} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: mutedColor }}
              axisLine={{ stroke: borderColor }}
              tickLine={false}
              label={{ value: "Month", position: "insideBottom", offset: -5, style: { fontSize: 12, fill: mutedColor } }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: mutedColor }}
              axisLine={{ stroke: borderColor }}
              tickLine={false}
              domain={[0, 400]}
              ticks={[0, 100, 200, 300, 400]}
              label={{
                value: "Sales in USD",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: { fontSize: 12, fill: mutedColor, textAnchor: "middle" },
              }}
            />
            <Tooltip
              contentStyle={{
                background: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: "4px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Sales"]}
            />
            <Area
              type="linear"
              dataKey="sales"
              stroke="#F5A623"
              strokeWidth={2}
              fill="url(#salesGradient)"
              dot={{ r: 3, fill: "#F5A623", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#F5A623" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
