import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import {
  FlatList,
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
import {
  CATEGORY_LABELS,
  Food,
  FoodCategory,
  FOODS,
  Measure,
  MEASURE_LABELS,
  calculateCalories,
} from "@/constants/foods";
import { todayStr, useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/useColors";
import { getRandomFeedback } from "@/constants/messages";

const CATEGORIES: ("todos" | FoodCategory)[] = [
  "todos",
  "carboidratos",
  "proteinas",
  "gorduras",
  "frutas",
  "vegetais",
  "bebidas",
  "industrializados",
];

const MEAL_TYPES = [
  { value: "cafe" as const, label: "Café" },
  { value: "almoco" as const, label: "Almoço" },
  { value: "jantar" as const, label: "Jantar" },
  { value: "lanche" as const, label: "Lanche" },
];

const MEASURES: Measure[] = [
  "gramas",
  "colher_sopa",
  "colher_cha",
  "concha",
  "xicara",
  "unidade",
  "fatia",
  "copo",
];

export default function FoodsScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { meals, addMeal, removeMeal } = useApp();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"todos" | FoodCategory>("todos");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return FOODS.filter((f) => {
      if (category !== "todos" && f.category !== category) return false;
      if (query.trim() && !f.name.toLowerCase().includes(query.toLowerCase().trim()))
        return false;
      return true;
    });
  }, [query, category]);

  const today = todayStr();
  const todayMeals = meals.filter((m) => m.date === today);

  const showFeedback = (text: string) => {
    setFeedback(text);
    setTimeout(() => setFeedback(null), 1800);
  };

  const webTopPad = Platform.OS === "web" ? 67 : 0;
  const webBottomPad = Platform.OS === "web" ? 100 : 100;

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <View
        style={{
          paddingTop: insets.top + 16 + webTopPad,
          paddingHorizontal: 16,
          gap: 12,
          paddingBottom: 8,
        }}
      >
        <Text style={[styles.title, { color: c.foreground }]}>Alimentos</Text>

        <View
          style={[
            styles.searchBox,
            { backgroundColor: c.card, borderColor: c.border, borderRadius: c.radius },
          ]}
        >
          <Feather name="search" size={18} color={c.mutedForeground} />
          <TextInput
            placeholder="Busca aí o que tu comeu..."
            placeholderTextColor={c.mutedForeground}
            value={query}
            onChangeText={setQuery}
            style={[styles.searchInput, { color: c.foreground }]}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Feather name="x" size={18} color={c.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingRight: 16 }}
        >
          {CATEGORIES.map((cat) => {
            const active = cat === category;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? c.primary : c.card,
                    borderColor: active ? c.primary : c.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: active ? c.primaryForeground : c.foreground,
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 12,
                  }}
                >
                  {cat === "todos" ? "Todos" : CATEGORY_LABELS[cat as FoodCategory]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + webBottomPad,
          gap: 8,
        }}
        ListHeaderComponent={
          todayMeals.length > 0 ? (
            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.sectionLabel, { color: c.mutedForeground }]}>
                REGISTRADAS HOJE ({todayMeals.length})
              </Text>
              <View style={{ gap: 8, marginTop: 8 }}>
                {todayMeals.slice(0, 4).map((m) => (
                  <Animated.View key={m.id} entering={FadeIn} layout={Layout}>
                    <Card style={{ flexDirection: "row", alignItems: "center", padding: 12 }}>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[styles.mealName, { color: c.foreground }]}
                          numberOfLines={1}
                        >
                          {m.foodName}
                        </Text>
                        <Text style={[styles.mealMeta, { color: c.mutedForeground }]}>
                          {m.grams}g · {m.calories} kcal
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          if (Platform.OS !== "web") Haptics.selectionAsync();
                          removeMeal(m.id);
                        }}
                        hitSlop={10}
                        style={[styles.iconBtn, { backgroundColor: c.muted }]}
                      >
                        <Feather name="trash-2" size={16} color={c.danger} />
                      </TouchableOpacity>
                    </Card>
                  </Animated.View>
                ))}
              </View>
              <Text
                style={[styles.sectionLabel, { color: c.mutedForeground, marginTop: 16 }]}
              >
                BASE DE ALIMENTOS
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 20).duration(300)}>
            <Pressable
              onPress={() => {
                if (Platform.OS !== "web") Haptics.selectionAsync();
                setSelectedFood(item);
              }}
              style={({ pressed }) => [
                styles.foodRow,
                {
                  backgroundColor: c.card,
                  borderColor: c.border,
                  borderRadius: c.radius,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View style={[styles.catDot, { backgroundColor: categoryColor(c, item.category) }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.foodName, { color: c.foreground }]}>{item.name}</Text>
                <Text style={[styles.foodMeta, { color: c.mutedForeground }]}>
                  {CATEGORY_LABELS[item.category]} · {item.kcalPer100g} kcal/100g
                </Text>
              </View>
              <View style={[styles.addBtn, { backgroundColor: c.primary }]}>
                <Feather name="plus" size={16} color={c.primaryForeground} />
              </View>
            </Pressable>
          </Animated.View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="search"
            title="Não achei esse aí"
            subtitle="Tenta com outra palavra"
          />
        }
      />

      {feedback && (
        <Animated.View
          entering={FadeIn}
          style={[
            styles.toast,
            {
              backgroundColor: c.foreground,
              bottom: insets.bottom + 100,
            },
          ]}
        >
          <Feather name="check" size={16} color={c.background} />
          <Text style={{ color: c.background, fontFamily: "Inter_600SemiBold", fontSize: 13 }}>
            {feedback}
          </Text>
        </Animated.View>
      )}

      <AddMealModal
        food={selectedFood}
        onClose={() => setSelectedFood(null)}
        onAdd={(measure, amount, mealType) => {
          if (!selectedFood) return;
          const { calories, grams } = calculateCalories(selectedFood, measure, amount);
          addMeal({
            foodId: selectedFood.id,
            foodName: selectedFood.name,
            category: selectedFood.category,
            measure,
            amount,
            grams,
            calories,
            mealType,
          });
          setSelectedFood(null);
          showFeedback(getRandomFeedback());
          if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
      />
    </View>
  );
}

function categoryColor(
  c: ReturnType<typeof useColors>,
  cat: FoodCategory,
): string {
  switch (cat) {
    case "carboidratos": return c.carbs;
    case "proteinas": return c.protein;
    case "gorduras": return c.fat;
    case "frutas": return c.fruit;
    case "bebidas": return c.drink;
    case "industrializados": return c.industrial;
    case "vegetais": return c.success;
    default: return c.muted;
  }
}

interface MealModalProps {
  food: Food | null;
  onClose: () => void;
  onAdd: (m: Measure, amount: number, mealType: "cafe" | "almoco" | "jantar" | "lanche") => void;
}

function AddMealModal({ food, onClose, onAdd }: MealModalProps) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const [measure, setMeasure] = useState<Measure>("gramas");
  const [amountStr, setAmountStr] = useState("100");
  const [mealType, setMealType] = useState<"cafe" | "almoco" | "jantar" | "lanche">("almoco");

  React.useEffect(() => {
    if (food) {
      setMeasure(food.unitGrams ? "unidade" : "gramas");
      setAmountStr(food.unitGrams ? "1" : "100");
      const h = new Date().getHours();
      setMealType(h < 11 ? "cafe" : h < 15 ? "almoco" : h < 19 ? "lanche" : "jantar");
    }
  }, [food]);

  if (!food) return null;
  const amount = Number(amountStr.replace(",", ".")) || 0;
  const preview = calculateCalories(food, measure, amount);

  return (
    <Modal visible={!!food} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={[styles.modalBg, { backgroundColor: c.overlay }]} onPress={onClose}>
        <Pressable
          style={[
            styles.modal,
            {
              backgroundColor: c.card,
              paddingBottom: insets.bottom + 24,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalHandle}>
            <View style={[styles.handle, { backgroundColor: c.border }]} />
          </View>
          <Text style={[styles.modalTitle, { color: c.foreground }]}>{food.name}</Text>
          <Text style={[styles.modalMeta, { color: c.mutedForeground }]}>
            {CATEGORY_LABELS[food.category]} · {food.kcalPer100g} kcal/100g
          </Text>

          <Text style={[styles.label, { color: c.mutedForeground }]}>Quantidade</Text>
          <View style={styles.amountRow}>
            <TouchableOpacity
              onPress={() => setAmountStr(String(Math.max(0, amount - (measure === "gramas" ? 10 : 1))))}
              style={[styles.stepBtn, { backgroundColor: c.muted }]}
            >
              <Feather name="minus" size={18} color={c.foreground} />
            </TouchableOpacity>
            <TextInput
              value={amountStr}
              onChangeText={setAmountStr}
              keyboardType="numeric"
              style={[
                styles.amountInput,
                { color: c.foreground, backgroundColor: c.muted, borderRadius: 14 },
              ]}
            />
            <TouchableOpacity
              onPress={() => setAmountStr(String(amount + (measure === "gramas" ? 10 : 1)))}
              style={[styles.stepBtn, { backgroundColor: c.muted }]}
            >
              <Feather name="plus" size={18} color={c.foreground} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { color: c.mutedForeground }]}>Medida</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
          >
            {MEASURES.map((m) => {
              const active = m === measure;
              return (
                <TouchableOpacity
                  key={m}
                  onPress={() => setMeasure(m)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active ? c.primary : c.muted,
                      borderColor: active ? c.primary : c.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: active ? c.primaryForeground : c.foreground,
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 12,
                    }}
                  >
                    {MEASURE_LABELS[m]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={[styles.label, { color: c.mutedForeground }]}>Refeição</Text>
          <View style={styles.mealTypeRow}>
            {MEAL_TYPES.map((t) => {
              const active = t.value === mealType;
              return (
                <TouchableOpacity
                  key={t.value}
                  onPress={() => setMealType(t.value)}
                  style={[
                    styles.mealTypeBtn,
                    {
                      backgroundColor: active ? c.secondary : c.muted,
                      borderColor: active ? c.primary : "transparent",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: active ? c.secondaryForeground : c.foreground,
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 12,
                    }}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[styles.previewRow, { backgroundColor: c.muted, borderRadius: 16 }]}>
            <View>
              <Text style={[styles.previewLabel, { color: c.mutedForeground }]}>Total</Text>
              <Text style={[styles.previewValue, { color: c.foreground }]}>
                {preview.calories} kcal
              </Text>
            </View>
            <Text style={[styles.previewMeta, { color: c.mutedForeground }]}>
              ≈ {preview.grams}g
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => onAdd(measure, amount, mealType)}
            disabled={amount <= 0}
            style={[
              styles.primaryBtn,
              {
                backgroundColor: amount > 0 ? c.primary : c.muted,
                borderRadius: 16,
              },
            ]}
          >
            <Text
              style={{
                color: amount > 0 ? c.primaryForeground : c.mutedForeground,
                fontFamily: "Inter_700Bold",
                fontSize: 15,
              }}
            >
              Adicionar refeição
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontFamily: "Inter_700Bold" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 6,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },
  foodRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  catDot: { width: 8, height: 8, borderRadius: 4 },
  foodName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  foodMeta: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  mealName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  mealMeta: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  toast: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  modalBg: { flex: 1, justifyContent: "flex-end" },
  modal: { padding: 20, gap: 8 },
  modalHandle: { alignItems: "center", marginBottom: 8 },
  handle: { width: 40, height: 4, borderRadius: 2 },
  modalTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  modalMeta: { fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 8 },
  label: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
    marginTop: 14,
    marginBottom: 8,
  },
  amountRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  amountInput: {
    flex: 1,
    height: 44,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  mealTypeRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  mealTypeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
  },
  previewRow: {
    marginTop: 16,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  previewValue: { fontSize: 22, fontFamily: "Inter_700Bold", marginTop: 2 },
  previewMeta: { fontSize: 13, fontFamily: "Inter_500Medium" },
  primaryBtn: {
    marginTop: 16,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});
