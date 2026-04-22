import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
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
import { DietPlan, useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/useColors";

const SECTIONS: {
  key: keyof DietPlan;
  title: string;
  icon: keyof typeof Feather.glyphMap;
  color: keyof ReturnType<typeof useColors>;
}[] = [
  { key: "cafe", title: "Café da manhã", icon: "sun", color: "warning" },
  { key: "almoco", title: "Almoço", icon: "coffee", color: "calorie" },
  { key: "jantar", title: "Jantar", icon: "moon", color: "fat" },
  { key: "lanche", title: "Lanches", icon: "package", color: "fruit" },
];

export default function DietScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { dietPlan, addDietItem, removeDietItem } = useApp();

  const [inputs, setInputs] = useState<Record<string, string>>({});

  const setInput = (k: string, v: string) =>
    setInputs((prev) => ({ ...prev, [k]: v }));

  const webTopPad = Platform.OS === "web" ? 67 : 0;
  const webBottomPad = Platform.OS === "web" ? 100 : 100;

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
        <View>
          <Text style={[styles.title, { color: c.foreground }]}>Minha Dieta</Text>
          <Text style={[styles.subtitle, { color: c.mutedForeground }]}>
            Monta teu plano de refeições aí, monstro
          </Text>
        </View>

        {SECTIONS.map((s, idx) => {
          const items = dietPlan[s.key];
          const inputKey = s.key;
          const value = inputs[inputKey] ?? "";
          const sectionColor =
            ((c as unknown as Record<string, string>)[s.color] as string) ?? c.primary;
          return (
            <Animated.View
              key={s.key}
              entering={FadeInDown.delay(idx * 80).duration(400)}
            >
              <Card>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <View
                      style={[
                        styles.iconBubble,
                        { backgroundColor: sectionColor + "22" },
                      ]}
                    >
                      <Feather name={s.icon} size={16} color={sectionColor} />
                    </View>
                    <Text style={[styles.sectionTitle, { color: c.foreground }]}>
                      {s.title}
                    </Text>
                  </View>
                  <Text style={[styles.sectionCount, { color: c.mutedForeground }]}>
                    {items.length}
                  </Text>
                </View>

                {items.length === 0 ? (
                  <EmptyState
                    icon="plus-circle"
                    title="Vazio por enquanto"
                    subtitle="Adiciona um item logo abaixo"
                  />
                ) : (
                  <View style={{ gap: 8, marginTop: 12 }}>
                    {items.map((it) => (
                      <Animated.View
                        key={it.id}
                        entering={FadeIn}
                        layout={Layout}
                        style={[styles.itemRow, { backgroundColor: c.muted }]}
                      >
                        <View style={[styles.bullet, { backgroundColor: sectionColor }]} />
                        <Text
                          style={[styles.itemText, { color: c.foreground }]}
                          numberOfLines={2}
                        >
                          {it.text}
                        </Text>
                        <TouchableOpacity
                          onPress={() => removeDietItem(s.key, it.id)}
                          hitSlop={10}
                        >
                          <Feather name="x" size={16} color={c.mutedForeground} />
                        </TouchableOpacity>
                      </Animated.View>
                    ))}
                  </View>
                )}

                <View style={[styles.addRow, { marginTop: 12 }]}>
                  <TextInput
                    placeholder={`Ex: ${
                      s.key === "cafe"
                        ? "ovos mexidos com pão"
                        : s.key === "almoco"
                        ? "arroz, feijão e frango"
                        : s.key === "jantar"
                        ? "salada e omelete"
                        : "fruta com whey"
                    }`}
                    placeholderTextColor={c.mutedForeground}
                    value={value}
                    onChangeText={(t) => setInput(inputKey, t)}
                    style={[
                      styles.input,
                      {
                        color: c.foreground,
                        backgroundColor: c.muted,
                        borderRadius: 12,
                      },
                    ]}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      if (!value.trim()) return;
                      addDietItem(s.key, value.trim());
                      setInput(inputKey, "");
                    }}
                    style={[
                      styles.addBtn,
                      {
                        backgroundColor: value.trim() ? sectionColor : c.muted,
                      },
                    ]}
                  >
                    <Feather
                      name="plus"
                      size={18}
                      color={value.trim() ? "#fff" : c.mutedForeground}
                    />
                  </TouchableOpacity>
                </View>
              </Card>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_500Medium", marginTop: 4 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  sectionCount: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
  },
  bullet: { width: 8, height: 8, borderRadius: 4 },
  itemText: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  addRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
