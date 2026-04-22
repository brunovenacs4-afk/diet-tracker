import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { useColors } from "@/hooks/useColors";

interface Props {
  value: number;
  max: number;
  color?: string;
  height?: number;
  trackColor?: string;
}

export function ProgressBar({ value, max, color, height = 14, trackColor }: Props) {
  const c = useColors();
  const pct = Math.max(0, Math.min(1, max > 0 ? value / max : 0));
  const sv = useSharedValue(0);

  useEffect(() => {
    sv.value = withTiming(pct, { duration: 700, easing: Easing.out(Easing.cubic) });
  }, [pct, sv]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${sv.value * 100}%`,
  }));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: trackColor ?? c.muted,
          borderRadius: height / 2,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: color ?? c.primary,
            borderRadius: height / 2,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: "100%", overflow: "hidden" },
  fill: { height: "100%" },
});
