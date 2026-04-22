import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";

import { useColors } from "@/hooks/useColors";

interface Props {
  data: { label: string; value: number }[];
  goal?: number;
  color?: string;
  height?: number;
  width?: number;
  formatValue?: (v: number) => string;
}

export function MiniLineChart({
  data,
  goal,
  color,
  height = 140,
  width = 320,
  formatValue,
}: Props) {
  const c = useColors();
  const lineColor = color ?? c.water;
  const padding = 24;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;
  const max = Math.max(goal ?? 0, ...data.map((d) => d.value), 1);

  const points = data.map((d, i) => {
    const x = padding + (data.length === 1 ? chartW / 2 : (i / (data.length - 1)) * chartW);
    const y = padding + chartH - (d.value / max) * chartH;
    return { x, y, value: d.value, label: d.label };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const fillD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1]!.x.toFixed(1)} ${(padding + chartH).toFixed(1)} L ${points[0]!.x.toFixed(1)} ${(padding + chartH).toFixed(1)} Z`
      : "";

  const goalY =
    goal && goal > 0
      ? padding + chartH - (Math.min(goal, max) / max) * chartH
      : null;

  return (
    <View>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={lineColor} stopOpacity="0.4" />
            <Stop offset="1" stopColor={lineColor} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        {goalY !== null && (
          <Path
            d={`M ${padding} ${goalY} L ${padding + chartW} ${goalY}`}
            stroke={c.mutedForeground}
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.5}
          />
        )}
        <Path d={fillD} fill="url(#lineGrad)" />
        <Path
          d={pathD}
          stroke={lineColor}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <Circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={c.card}
            stroke={lineColor}
            strokeWidth={2}
          />
        ))}
      </Svg>
      <View style={styles.labels}>
        {data.map((d, i) => (
          <View key={i} style={styles.labelCol}>
            <Text style={[styles.label, { color: c.mutedForeground }]}>
              {d.label}
            </Text>
            <Text style={[styles.value, { color: c.foreground }]}>
              {formatValue ? formatValue(d.value) : d.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labels: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 12, marginTop: -8 },
  labelCol: { alignItems: "center", flex: 1 },
  label: { fontSize: 10, fontFamily: "Inter_500Medium" },
  value: { fontSize: 11, fontFamily: "Inter_600SemiBold", marginTop: 2 },
});
