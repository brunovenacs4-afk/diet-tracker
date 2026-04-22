import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { useColors } from "@/hooks/useColors";

interface Props {
  data: { label: string; value: number }[];
  goal?: number;
  color?: string;
  height?: number;
  formatValue?: (v: number) => string;
}

function Bar({
  value,
  max,
  color,
  delay,
  height,
}: {
  value: number;
  max: number;
  color: string;
  delay: number;
  height: number;
}) {
  const sv = useSharedValue(0);
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  React.useEffect(() => {
    sv.value = withDelay(
      delay,
      withTiming(pct, { duration: 600, easing: Easing.out(Easing.cubic) }),
    );
  }, [pct, sv, delay]);
  const style = useAnimatedStyle(() => ({
    height: sv.value * height,
  }));
  return (
    <View style={[barStyles.barContainer, { height }]}>
      <Animated.View
        style={[
          barStyles.bar,
          { backgroundColor: color },
          style,
        ]}
      />
    </View>
  );
}

export function MiniBarChart({
  data,
  goal,
  color,
  height = 120,
  formatValue,
}: Props) {
  const c = useColors();
  const max = Math.max(goal ?? 0, ...data.map((d) => d.value), 1);
  return (
    <View>
      <View style={[styles.row, { height }]}>
        {data.map((d, i) => (
          <View key={d.label + i} style={styles.col}>
            <Text style={[styles.value, { color: c.mutedForeground }]}>
              {formatValue ? formatValue(d.value) : d.value > 0 ? d.value : ""}
            </Text>
            <Bar
              value={d.value}
              max={max}
              color={color ?? c.primary}
              delay={i * 80}
              height={height - 32}
            />
          </View>
        ))}
      </View>
      <View style={styles.row}>
        {data.map((d, i) => (
          <View key={"l" + i} style={styles.col}>
            <Text style={[styles.label, { color: c.mutedForeground }]}>
              {d.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end", gap: 6 },
  col: { flex: 1, alignItems: "center" },
  value: { fontSize: 10, marginBottom: 4, fontFamily: "Inter_500Medium" },
  label: { fontSize: 11, marginTop: 6, fontFamily: "Inter_500Medium" },
});

const barStyles = StyleSheet.create({
  barContainer: { width: "70%", justifyContent: "flex-end" },
  bar: { width: "100%", borderTopLeftRadius: 6, borderTopRightRadius: 6 },
});
