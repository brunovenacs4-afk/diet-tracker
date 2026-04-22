import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card } from "@/components/Card";
import { Confetti } from "@/components/Confetti";
import { EmptyState } from "@/components/EmptyState";
import { MiniBarChart } from "@/components/MiniBarChart";
import { ProgressBar } from "@/components/ProgressBar";
import {
  caloriesForDate,
  last7Days,
  todayStr,
  useApp,
  waterForDate,
} from "@/contexts/AppContext";
import { useColors } from "@/hooks/useColors";
import {
  getCalorieMessage,
  getTimeOfDayMessage,
  getWaterMessage,
} from "@/constants/messages";

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function HomeScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { profile, meals, waterLogs, toggleTheme, theme } = useApp();
  const today = todayStr();

  const calories = caloriesForDate(meals, today);
  const water = waterForDate(waterLogs, today);
  const calPct = profile.calorieGoal > 0 ? calories / profile.calorieGoal : 0;
  const waterPct = profile.waterGoal > 0 ? water / profile.waterGoal : 0;

  const last7 = useMemo(() => last7Days(), []);
  const calData = last7.map((d) => {
    const day = new Date(d).getDay();
    return { label: DAY_LABELS[day]!, value: caloriesForDate(meals, d) };
  });

  const [confettiKey, setConfettiKey] = useState(0);
  const goalReached = useRef(false);
  useEffect(() => {
    const reached = calPct >= 1 && profile.calorieGoal > 0;
    if (reached && !goalReached.current) {
      goalReached.current = true;
      setConfettiKey((k) => k + 1);
    }
    if (!reached) goalReached.current = false;
  }, [calPct, profile.calorieGoal]);

  const todayMeals = meals.filter((m) => m.date === today).slice(0, 5);

  const webTopPad = Platform.OS === "web" ? 67 : 0;
  const webBottomPad = Platform.OS === "web" ? 100 : 100;

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <Confetti fire={confettiKey} />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16 + webTopPad,
          paddingBottom: insets.bottom + webBottomPad,
          paddingHorizontal: 16,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.greeting, { color: c.mutedForeground }]}>
              {getTimeOfDayMessage()}
            </Text>
            <Text style={[styles.name, { color: c.foreground }]}>
              {profile.name ? `E aí, ${profile.name}!` : "E aí, monstro!"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.themeBtn, { backgroundColor: c.card, borderColor: c.border }]}
          >
            <Feather
              name={theme === "dark" ? "sun" : "moon"}
              size={18}
              color={c.foreground}
            />
          </TouchableOpacity>
        </View>

        {/* Calorie hero card */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <View style={[styles.heroCard, { borderRadius: c.radius, overflow: "hidden" }]}>
            <LinearGradient
              colors={
                theme === "dark"
                  ? ["#065f46", "#0e7490"]
                  : ["#10b981", "#06b6d4"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroInner}
            >
              <View style={styles.heroRow}>
                <View>
                  <Text style={styles.heroLabel}>Calorias hoje</Text>
                  <View style={styles.heroValueRow}>
                    <Text style={styles.heroValue}>{calories}</Text>
                    <Text style={styles.heroGoal}>
                      / {profile.calorieGoal} kcal
                    </Text>
                  </View>
                </View>
                <View style={styles.pctBadge}>
                  <Text style={styles.pctBadgeText}>
                    {Math.round(calPct * 100)}%
                  </Text>
                </View>
              </View>
              <View style={{ marginTop: 14 }}>
                <ProgressBar
                  value={calories}
                  max={profile.calorieGoal}
                  color="rgba(255,255,255,0.95)"
                  trackColor="rgba(255,255,255,0.25)"
                  height={12}
                />
              </View>
              <Text style={styles.heroMsg}>
                {getCalorieMessage(calories, profile.calorieGoal)}
              </Text>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Water card */}
        <Animated.View entering={FadeInDown.delay(80).duration(400)}>
          <Card>
            <View style={styles.cardHeader}>
              <View style={styles.iconLabelRow}>
                <View style={[styles.iconBubble, { backgroundColor: c.water + "22" }]}>
                  <Feather name="droplet" size={16} color={c.water} />
                </View>
                <Text style={[styles.cardTitle, { color: c.foreground }]}>
                  Água
                </Text>
              </View>
              <Text style={[styles.cardValue, { color: c.foreground }]}>
                {(water / 1000).toFixed(1)}L
                <Text style={{ color: c.mutedForeground, fontSize: 13 }}>
                  {" "}/ {(profile.waterGoal / 1000).toFixed(1)}L
                </Text>
              </Text>
            </View>
            <View style={{ marginTop: 12 }}>
              <ProgressBar
                value={water}
                max={profile.waterGoal}
                color={
                  waterPct >= 1 ? c.success : waterPct >= 0.5 ? c.water : c.warning
                }
              />
            </View>
            <Text style={[styles.cardMsg, { color: c.mutedForeground }]}>
              {getWaterMessage(water, profile.waterGoal)}
            </Text>
          </Card>
        </Animated.View>

        {/* 7-day calories chart */}
        <Animated.View entering={FadeInDown.delay(160).duration(400)}>
          <Card>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: c.foreground }]}>
                Últimos 7 dias
              </Text>
              <Text style={[styles.cardSubtle, { color: c.mutedForeground }]}>
                Calorias
              </Text>
            </View>
            <View style={{ marginTop: 16 }}>
              <MiniBarChart
                data={calData}
                goal={profile.calorieGoal}
                color={c.calorie}
                height={140}
              />
            </View>
          </Card>
        </Animated.View>

        {/* Recent meals */}
        <Animated.View entering={FadeInDown.delay(240).duration(400)}>
          <Card>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: c.foreground }]}>
                Refeições de hoje
              </Text>
              <Text style={[styles.cardSubtle, { color: c.mutedForeground }]}>
                {todayMeals.length} {todayMeals.length === 1 ? "item" : "itens"}
              </Text>
            </View>
            {todayMeals.length === 0 ? (
              <EmptyState
                icon="coffee"
                title="Nenhuma refeição registrada"
                subtitle="Bora começar pela aba Alimentos!"
              />
            ) : (
              <View style={{ gap: 10, marginTop: 12 }}>
                {todayMeals.map((m) => (
                  <Animated.View
                    key={m.id}
                    entering={FadeIn}
                    style={[styles.mealRow, { borderColor: c.border }]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.mealName, { color: c.foreground }]}
                        numberOfLines={1}
                      >
                        {m.foodName}
                      </Text>
                      <Text style={[styles.mealMeta, { color: c.mutedForeground }]}>
                        {m.grams}g · {m.mealType === "cafe" ? "Café" : m.mealType === "almoco" ? "Almoço" : m.mealType === "jantar" ? "Jantar" : "Lanche"}
                      </Text>
                    </View>
                    <Text style={[styles.mealKcal, { color: c.calorie }]}>
                      {m.calories} kcal
                    </Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  greeting: { fontSize: 13, fontFamily: "Inter_500Medium" },
  name: { fontSize: 24, fontFamily: "Inter_700Bold", marginTop: 2 },
  themeBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  heroCard: {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  heroInner: { padding: 22 },
  heroRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  heroLabel: { color: "rgba(255,255,255,0.85)", fontSize: 13, fontFamily: "Inter_500Medium" },
  heroValueRow: { flexDirection: "row", alignItems: "baseline", marginTop: 2 },
  heroValue: { color: "#fff", fontSize: 38, fontFamily: "Inter_700Bold" },
  heroGoal: { color: "rgba(255,255,255,0.85)", fontSize: 14, fontFamily: "Inter_500Medium", marginLeft: 6 },
  heroMsg: { color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold", marginTop: 14 },
  pctBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pctBadgeText: { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 14 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconLabelRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  cardSubtle: { fontSize: 12, fontFamily: "Inter_500Medium" },
  cardValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  cardMsg: { fontSize: 13, fontFamily: "Inter_500Medium", marginTop: 10 },
  mealRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  mealName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  mealMeta: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  mealKcal: { fontSize: 14, fontFamily: "Inter_700Bold" },
});
