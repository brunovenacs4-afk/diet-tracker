import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown, Layout } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { MiniLineChart } from "@/components/MiniLineChart";
import { WaterGlass } from "@/components/WaterGlass";
import {
  calculateStreak,
  last7Days,
  todayStr,
  useApp,
  waterForDate,
} from "@/contexts/AppContext";
import { useColors } from "@/hooks/useColors";
import { getWaterMessage } from "@/constants/messages";

const QUICK = [200, 300, 500];
const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function WaterScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { profile, waterLogs, addWater, removeWater } = useApp();

  const today = todayStr();
  const consumed = waterForDate(waterLogs, today);
  const pct = profile.waterGoal > 0 ? consumed / profile.waterGoal : 0;
  const streak = useMemo(
    () => calculateStreak(waterLogs, profile.waterGoal),
    [waterLogs, profile.waterGoal],
  );

  const last7 = useMemo(() => last7Days(), []);
  const lineData = last7.map((d) => {
    const day = new Date(d).getDay();
    return { label: DAY_LABELS[day]!, value: waterForDate(waterLogs, d) };
  });

  const [splashKey, setSplashKey] = useState(0);

  const todayLogs = waterLogs.filter((w) => w.date === today);

  const handleAdd = (ml: number) => {
    addWater(ml);
    setSplashKey((k) => k + 1);
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const webTopPad = Platform.OS === "web" ? 67 : 0;
  const webBottomPad = Platform.OS === "web" ? 100 : 100;

  const screenW = Dimensions.get("window").width;
  const chartW = Math.min(screenW - 64, 360);

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16 + webTopPad,
          paddingBottom: insets.bottom + webBottomPad,
          paddingHorizontal: 16,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.title, { color: c.foreground }]}>Hidratação</Text>
            <Text style={[styles.subtitle, { color: c.mutedForeground }]}>
              {getWaterMessage(consumed, profile.waterGoal)}
            </Text>
          </View>
          {streak > 0 && (
            <View style={[styles.streakBadge, { backgroundColor: c.warning + "22" }]}>
              <Feather name="zap" size={14} color={c.warning} />
              <Text style={[styles.streakText, { color: c.warning }]}>
                {streak}d
              </Text>
            </View>
          )}
        </View>

        {/* Glass + counter */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <Card style={{ alignItems: "center", paddingVertical: 24 }}>
            <WaterGlass pct={pct} size={180} splashKey={splashKey} />
            <View style={{ alignItems: "center", marginTop: 18 }}>
              <Text style={[styles.bigValue, { color: c.foreground }]}>
                {(consumed / 1000).toFixed(2)}
                <Text style={[styles.bigUnit, { color: c.mutedForeground }]}> L</Text>
              </Text>
              <Text style={[styles.goalText, { color: c.mutedForeground }]}>
                meta {(profile.waterGoal / 1000).toFixed(1)}L · {Math.round(pct * 100)}%
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Quick add */}
        <Animated.View entering={FadeInDown.delay(80).duration(400)}>
          <View style={styles.quickRow}>
            {QUICK.map((ml) => (
              <Pressable
                key={ml}
                onPress={() => handleAdd(ml)}
                style={({ pressed }) => [
                  styles.quickBtn,
                  {
                    backgroundColor: c.card,
                    borderColor: c.border,
                    borderRadius: c.radius,
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                  },
                ]}
              >
                <View style={[styles.quickIcon, { backgroundColor: c.water + "22" }]}>
                  <Feather name="droplet" size={18} color={c.water} />
                </View>
                <Text style={[styles.quickValue, { color: c.foreground }]}>
                  +{ml}ml
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* 7 day chart */}
        <Animated.View entering={FadeInDown.delay(160).duration(400)}>
          <Card>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: c.foreground }]}>
                Últimos 7 dias
              </Text>
              <Text style={[styles.cardSubtle, { color: c.mutedForeground }]}>
                em ml
              </Text>
            </View>
            <View style={{ marginTop: 12, alignItems: "center" }}>
              <MiniLineChart
                data={lineData}
                goal={profile.waterGoal}
                color={c.water}
                width={chartW}
                height={150}
                formatValue={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}L` : `${v}`)}
              />
            </View>
          </Card>
        </Animated.View>

        {/* Today's logs */}
        <Animated.View entering={FadeInDown.delay(240).duration(400)}>
          <Card>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: c.foreground }]}>
                Registros de hoje
              </Text>
              <Text style={[styles.cardSubtle, { color: c.mutedForeground }]}>
                {todayLogs.length}
              </Text>
            </View>
            {todayLogs.length === 0 ? (
              <EmptyState
                icon="droplet"
                title="Nada por aqui ainda"
                subtitle="Bora começar com um copão!"
              />
            ) : (
              <View style={{ gap: 8, marginTop: 12 }}>
                {todayLogs.map((w) => (
                  <Animated.View
                    key={w.id}
                    entering={FadeIn}
                    layout={Layout}
                    style={[styles.logRow, { borderColor: c.border }]}
                  >
                    <View style={[styles.logIcon, { backgroundColor: c.water + "22" }]}>
                      <Feather name="droplet" size={14} color={c.water} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.logValue, { color: c.foreground }]}>
                        {w.ml}ml
                      </Text>
                      <Text style={[styles.logTime, { color: c.mutedForeground }]}>
                        {w.time}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeWater(w.id)}
                      hitSlop={10}
                      style={[styles.iconBtn, { backgroundColor: c.muted }]}
                    >
                      <Feather name="trash-2" size={14} color={c.danger} />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            )}
          </Card>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontSize: 28, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_500Medium", marginTop: 4, maxWidth: 250 },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  streakText: { fontFamily: "Inter_700Bold", fontSize: 13 },
  bigValue: { fontSize: 42, fontFamily: "Inter_700Bold" },
  bigUnit: { fontSize: 18, fontFamily: "Inter_500Medium" },
  goalText: { fontSize: 13, fontFamily: "Inter_500Medium", marginTop: 4 },
  quickRow: { flexDirection: "row", gap: 10 },
  quickBtn: {
    flex: 1,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1,
    gap: 8,
  },
  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  quickValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  cardSubtle: { fontSize: 12, fontFamily: "Inter_500Medium" },
  logRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  logIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  logValue: { fontSize: 14, fontFamily: "Inter_700Bold" },
  logTime: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
