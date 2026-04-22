import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown, Layout } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { MiniBarChart } from "@/components/MiniBarChart";
import {
  burnedForDate,
  caloriesForDate,
  last7Days,
  todayStr,
  useApp,
} from "@/contexts/AppContext";
import { useColors } from "@/hooks/useColors";
import { WORKOUT_TYPES, calculateBurned, type WorkoutType } from "@/constants/workouts";

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function getBurnMessage(burned: number): string {
  if (burned === 0) return "Bora suar a camisa hoje, monstro!";
  if (burned < 100) return "Começou! Continua nessa vibe.";
  if (burned < 300) return "Tá se mexendo, gigante!";
  if (burned < 500) return "Que pegada, bicho!";
  if (burned < 800) return "Tá voando! Sem freio.";
  return "Lenda viva. Hoje tu detonou!";
}

export default function HealthScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { profile, meals, workouts, addWorkout, removeWorkout } = useApp();

  const today = todayStr();
  const consumed = caloriesForDate(meals, today);
  const burned = burnedForDate(workouts, today);
  const balance = consumed - burned;

  const last7 = useMemo(() => last7Days(), []);
  const barData = last7.map((d) => {
    const day = new Date(d).getDay();
    return { label: DAY_LABELS[day]!, value: burnedForDate(workouts, d) };
  });

  const todayWorkouts = workouts.filter((w) => w.date === today);
  const totalMinutes = todayWorkouts.reduce((s, w) => s + w.minutes, 0);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [selected, setSelected] = useState<WorkoutType | null>(null);
  const [minutesText, setMinutesText] = useState("30");

  const openPicker = () => {
    setSelected(null);
    setMinutesText("30");
    setPickerOpen(true);
  };

  const confirmAdd = () => {
    if (!selected) return;
    const minutes = Math.max(1, parseInt(minutesText, 10) || 0);
    const cal = calculateBurned(selected.met, profile.weight, minutes);
    addWorkout({
      workoutTypeId: selected.id,
      name: selected.name,
      met: selected.met,
      minutes,
      caloriesBurned: cal,
    });
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPickerOpen(false);
  };

  const webTopPad = Platform.OS === "web" ? 67 : 0;
  const webBottomPad = Platform.OS === "web" ? 100 : 100;

  const screenW = Dimensions.get("window").width;
  const chartW = Math.min(screenW - 64, 360);

  const previewKcal =
    selected && profile.weight > 0
      ? calculateBurned(selected.met, profile.weight, parseInt(minutesText, 10) || 0)
      : 0;

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
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: c.foreground }]}>Saúde</Text>
            <Text style={[styles.subtitle, { color: c.mutedForeground }]}>
              {getBurnMessage(burned)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={openPicker}
            style={[styles.addBtn, { backgroundColor: c.primary }]}
            activeOpacity={0.85}
          >
            <Feather name="plus" size={18} color={c.primaryForeground} />
          </TouchableOpacity>
        </View>

        {/* Balance card */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <Card>
            <Text style={[styles.cardTitle, { color: c.foreground }]}>
              Balanço de hoje
            </Text>
            <View style={styles.balanceRow}>
              <View style={styles.balanceCol}>
                <View style={[styles.dot, { backgroundColor: c.primary }]} />
                <Text style={[styles.balanceLabel, { color: c.mutedForeground }]}>
                  Consumidas
                </Text>
                <Text style={[styles.balanceValue, { color: c.foreground }]}>
                  {consumed}
                </Text>
                <Text style={[styles.balanceUnit, { color: c.mutedForeground }]}>kcal</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: c.border }]} />
              <View style={styles.balanceCol}>
                <View style={[styles.dot, { backgroundColor: c.danger }]} />
                <Text style={[styles.balanceLabel, { color: c.mutedForeground }]}>
                  Queimadas
                </Text>
                <Text style={[styles.balanceValue, { color: c.danger }]}>
                  −{burned}
                </Text>
                <Text style={[styles.balanceUnit, { color: c.mutedForeground }]}>kcal</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: c.border }]} />
              <View style={styles.balanceCol}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: balance > 0 ? c.warning : c.success },
                  ]}
                />
                <Text style={[styles.balanceLabel, { color: c.mutedForeground }]}>
                  Saldo
                </Text>
                <Text
                  style={[
                    styles.balanceValue,
                    { color: balance > 0 ? c.warning : c.success },
                  ]}
                >
                  {balance > 0 ? "+" : ""}
                  {balance}
                </Text>
                <Text style={[styles.balanceUnit, { color: c.mutedForeground }]}>kcal</Text>
              </View>
            </View>
            <View style={[styles.summaryRow, { borderTopColor: c.border }]}>
              <View style={styles.summaryItem}>
                <Feather name="clock" size={14} color={c.mutedForeground} />
                <Text style={[styles.summaryText, { color: c.mutedForeground }]}>
                  {totalMinutes} min hoje
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Feather name="zap" size={14} color={c.mutedForeground} />
                <Text style={[styles.summaryText, { color: c.mutedForeground }]}>
                  {todayWorkouts.length}{" "}
                  {todayWorkouts.length === 1 ? "treino" : "treinos"}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* 7-day chart */}
        <Animated.View entering={FadeInDown.delay(80).duration(400)}>
          <Card>
            <View style={styles.cardHeaderRow}>
              <Text style={[styles.cardTitle, { color: c.foreground }]}>
                Calorias queimadas
              </Text>
              <Text style={[styles.cardSubtle, { color: c.mutedForeground }]}>
                últimos 7 dias
              </Text>
            </View>
            <View style={{ marginTop: 12, alignItems: "center" }}>
              <MiniBarChart
                data={barData}
                color={c.danger}
                height={140}
                formatValue={(v) => `${v}`}
              />
            </View>
          </Card>
        </Animated.View>

        {/* Today logs */}
        <Animated.View entering={FadeInDown.delay(160).duration(400)}>
          <Card>
            <View style={styles.cardHeaderRow}>
              <Text style={[styles.cardTitle, { color: c.foreground }]}>
                Treinos de hoje
              </Text>
              <Text style={[styles.cardSubtle, { color: c.mutedForeground }]}>
                {todayWorkouts.length}
              </Text>
            </View>
            {todayWorkouts.length === 0 ? (
              <EmptyState
                icon="activity"
                title="Sem treinos hoje"
                subtitle="Toca no + e bora queimar essas calorias!"
              />
            ) : (
              <View style={{ gap: 8, marginTop: 12 }}>
                {todayWorkouts.map((w) => (
                  <Animated.View
                    key={w.id}
                    entering={FadeIn}
                    layout={Layout}
                    style={[styles.logRow, { borderColor: c.border }]}
                  >
                    <View
                      style={[styles.logIcon, { backgroundColor: c.danger + "22" }]}
                    >
                      <Feather name="activity" size={14} color={c.danger} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.logName, { color: c.foreground }]}>
                        {w.name}
                      </Text>
                      <Text style={[styles.logMeta, { color: c.mutedForeground }]}>
                        {w.minutes} min · {w.time}
                      </Text>
                    </View>
                    <Text style={[styles.logKcal, { color: c.danger }]}>
                      −{w.caloriesBurned} kcal
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeWorkout(w.id)}
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

        {/* Integration note */}
        <Animated.View entering={FadeInDown.delay(240).duration(400)}>
          <Card style={{ backgroundColor: c.primary + "0F", borderColor: c.primary + "33" }}>
            <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
              <View style={[styles.infoIcon, { backgroundColor: c.primary + "22" }]}>
                <Feather name="info" size={16} color={c.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoTitle, { color: c.foreground }]}>
                  Sincronizar com Apple Saúde / Google Fit
                </Text>
                <Text style={[styles.infoText, { color: c.mutedForeground }]}>
                  A leitura automática dos teus treinos do Apple Saúde ou Google Fit
                  precisa de uma versão nativa do app instalada. Por enquanto, registra
                  teus treinos aqui e o cálculo de calorias queimadas usa teu peso
                  ({profile.weight}kg) automaticamente.
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>

      {/* Picker modal */}
      <Modal
        visible={pickerOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setPickerOpen(false)}
      >
        <View style={styles.modalBg}>
          <View
            style={[
              styles.modalSheet,
              {
                backgroundColor: c.card,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
              },
            ]}
          >
            <View style={styles.modalHandle}>
              <View style={[styles.handleBar, { backgroundColor: c.border }]} />
            </View>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: c.foreground }]}>
                Adicionar treino
              </Text>
              <TouchableOpacity
                onPress={() => setPickerOpen(false)}
                hitSlop={10}
                style={[styles.iconBtn, { backgroundColor: c.muted }]}
              >
                <Feather name="x" size={16} color={c.foreground} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ maxHeight: 280 }}
              contentContainerStyle={{ padding: 16, gap: 8 }}
              showsVerticalScrollIndicator={false}
            >
              {WORKOUT_TYPES.map((w) => {
                const isSel = selected?.id === w.id;
                return (
                  <Pressable
                    key={w.id}
                    onPress={() => setSelected(w)}
                    style={({ pressed }) => [
                      styles.workoutItem,
                      {
                        backgroundColor: isSel ? c.primary + "1A" : c.background,
                        borderColor: isSel ? c.primary : c.border,
                        borderRadius: c.radius,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.workoutIcon,
                        {
                          backgroundColor: isSel ? c.primary + "33" : c.muted,
                        },
                      ]}
                    >
                      <Feather
                        name={w.icon}
                        size={16}
                        color={isSel ? c.primary : c.mutedForeground}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.workoutName, { color: c.foreground }]}>
                        {w.name}
                      </Text>
                      <Text
                        style={[styles.workoutMet, { color: c.mutedForeground }]}
                      >
                        ~{calculateBurned(w.met, profile.weight, 30)} kcal em 30min
                      </Text>
                    </View>
                    {isSel && (
                      <Feather name="check-circle" size={18} color={c.primary} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={[styles.modalFooter, { borderTopColor: c.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: c.mutedForeground }]}>
                  Duração (min)
                </Text>
                <TextInput
                  value={minutesText}
                  onChangeText={setMinutesText}
                  keyboardType="number-pad"
                  style={[
                    styles.input,
                    {
                      color: c.foreground,
                      borderColor: c.border,
                      backgroundColor: c.background,
                      borderRadius: c.radius,
                    },
                  ]}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: c.mutedForeground }]}>
                  Vai queimar
                </Text>
                <View
                  style={[
                    styles.preview,
                    {
                      borderColor: c.border,
                      backgroundColor: c.background,
                      borderRadius: c.radius,
                    },
                  ]}
                >
                  <Text style={[styles.previewValue, { color: c.danger }]}>
                    {previewKcal} kcal
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ padding: 16, paddingTop: 0 }}>
              <TouchableOpacity
                onPress={confirmAdd}
                disabled={!selected}
                style={[
                  styles.confirmBtn,
                  {
                    backgroundColor: selected ? c.primary : c.muted,
                    borderRadius: c.radius,
                  },
                ]}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.confirmText,
                    { color: selected ? c.primaryForeground : c.mutedForeground },
                  ]}
                >
                  Adicionar treino
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  title: { fontSize: 28, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_500Medium", marginTop: 4 },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardSubtle: { fontSize: 12, fontFamily: "Inter_500Medium" },
  balanceRow: {
    flexDirection: "row",
    marginTop: 14,
    alignItems: "stretch",
  },
  balanceCol: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
    gap: 2,
  },
  divider: { width: StyleSheet.hairlineWidth, marginHorizontal: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: 4 },
  balanceLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  balanceValue: { fontSize: 22, fontFamily: "Inter_700Bold" },
  balanceUnit: { fontSize: 10, fontFamily: "Inter_500Medium" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  summaryItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  summaryText: { fontSize: 12, fontFamily: "Inter_500Medium" },
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
  logName: { fontSize: 14, fontFamily: "Inter_700Bold" },
  logMeta: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  logKcal: { fontSize: 13, fontFamily: "Inter_700Bold" },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  infoTitle: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 4 },
  infoText: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  modalSheet: { paddingBottom: 12 },
  modalHandle: { alignItems: "center", paddingTop: 10 },
  handleBar: { width: 40, height: 4, borderRadius: 2 },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  modalTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  workoutItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderWidth: 1,
  },
  workoutIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  workoutName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  workoutMet: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  fieldLabel: { fontSize: 11, fontFamily: "Inter_500Medium", marginBottom: 6 },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  preview: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  previewValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  confirmBtn: {
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmText: { fontSize: 15, fontFamily: "Inter_700Bold" },
});
