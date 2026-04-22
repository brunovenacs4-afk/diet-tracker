import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from "react-native-reanimated";

const { width: WIN_W } = Dimensions.get("window");
const COLORS = ["#10b981", "#06b6d4", "#f59e0b", "#ef4444", "#a855f7", "#facc15"];

function Piece({ index, fire }: { index: number; fire: number }) {
  const x = useSharedValue(WIN_W / 2);
  const y = useSharedValue(0);
  const rot = useSharedValue(0);
  const op = useSharedValue(0);

  useEffect(() => {
    if (fire > 0) {
      const targetX = Math.random() * WIN_W;
      const targetY = 200 + Math.random() * 400;
      const delay = index * 30;
      op.value = withDelay(delay, withTiming(1, { duration: 100 }));
      x.value = withDelay(delay, withTiming(targetX, { duration: 1500, easing: Easing.out(Easing.quad) }));
      y.value = withDelay(delay, withTiming(targetY, { duration: 1500, easing: Easing.out(Easing.quad) }));
      rot.value = withDelay(delay, withTiming(720, { duration: 1500 }));
      op.value = withDelay(delay + 1100, withTiming(0, { duration: 400 }));
    }
  }, [fire, index, x, y, rot, op]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${rot.value}deg` },
    ],
    opacity: op.value,
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        { backgroundColor: COLORS[index % COLORS.length] },
        style,
      ]}
    />
  );
}

export function Confetti({ fire }: { fire: number }) {
  if (fire === 0) return null;
  const pieces = Array.from({ length: 28 });
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((_, i) => (
        <Piece key={`${fire}-${i}`} index={i} fire={fire} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: "absolute",
    width: 10,
    height: 16,
    borderRadius: 2,
    top: -20,
  },
});
