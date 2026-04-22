import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { useColors } from "@/hooks/useColors";

interface Props {
  pct: number;
  size?: number;
  splashKey?: number;
}

export function WaterGlass({ pct, size = 180, splashKey = 0 }: Props) {
  const c = useColors();
  const fill = useSharedValue(0);
  const splash = useSharedValue(0);
  const wave = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(Math.max(0, Math.min(1, pct)), {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [pct, fill]);

  useEffect(() => {
    if (splashKey > 0) {
      splash.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 500 }),
      );
    }
  }, [splashKey, splash]);

  useEffect(() => {
    wave.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [wave]);

  const waterStyle = useAnimatedStyle(() => ({
    height: `${fill.value * 100}%`,
  }));

  const waveStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -8 + wave.value * 16 },
      { translateY: -4 + wave.value * 8 },
    ],
  }));

  const splashStyle = useAnimatedStyle(() => ({
    opacity: splash.value,
    transform: [{ scale: 1 + splash.value * 0.4 }],
  }));

  const color =
    pct >= 1 ? c.success : pct >= 0.5 ? c.water : pct > 0 ? c.warning : c.danger;

  return (
    <View
      style={[
        styles.glass,
        {
          width: size,
          height: size,
          borderColor: c.border,
          backgroundColor: c.muted,
        },
      ]}
    >
      <Animated.View
        style={[styles.water, { backgroundColor: color }, waterStyle]}
      >
        <Animated.View
          style={[
            styles.wave,
            { backgroundColor: color, opacity: 0.6 },
            waveStyle,
          ]}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.splash,
          { borderColor: color },
          splashStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  glass: {
    borderRadius: 999,
    borderWidth: 4,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  water: { width: "100%", overflow: "hidden" },
  wave: {
    position: "absolute",
    top: -8,
    left: -16,
    right: -16,
    height: 16,
    borderRadius: 8,
  },
  splash: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 999,
    borderWidth: 6,
  },
});
