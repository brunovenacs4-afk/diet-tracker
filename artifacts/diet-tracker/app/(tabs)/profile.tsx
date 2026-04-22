import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card } from "@/components/Card";
import { Profile, useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ProfileScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { profile, setProfile, theme, toggleTheme } = useApp();

  const [name, setName] = useState(profile.name);
  const [height, setHeight] = useState(profile.height ? String(profile.height) : "");
  const [weight, setWeight] = useState(profile.weight ? String(profile.weight) : "");
  const [calorieGoal, setCalorieGoal] = useState(String(profile.calorieGoal));
  const [waterGoalL, setWaterGoalL] = useState(String((profile.waterGoal / 1000).toFixed(1)));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(profile.name);
    setHeight(profile.height ? String(profile.height) : "");
    setWeight(profile.weight ? String(profile.weight) : "");
    setCalorieGoal(String(profile.calorieGoal));
    setWaterGoalL(String((profile.waterGoal / 1000).toFixed(1)));
  }, [profile]);

  const bmi =
    profile.height > 0 && profile.weight > 0
      ? profile.weight / Math.pow(profile.height / 100, 2)
      : null;

  const bmiLabel = (v: number) => {
    if (v < 18.5) return "Abaixo do peso";
    if (v < 25) return "Peso ideal";
    if (v < 30) return "Sobrepeso";
    return "Obesidade";
  };

  const onSave = () => {
    const next: Profile = {
      name: name.trim(),
      height: Number(height) || 0,
      weight: Number(weight.replace(",", ".")) || 0,
      calorieGoal: Math.max(0, Math.round(Number(calorieGoal) || 0)),
      waterGoal: Math.max(0, Math.round(Number(waterGoalL.replace(",", ".")) * 1000) || 0),
    };
    setProfile(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

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
        <View style={styles.headerRow}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: c.primary + "22" },
            ]}
          >
            <Feather name="user" size={28} color={c.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: c.foreground }]}>
              {profile.name || "Sem nome ainda"}
            </Text>
            {bmi !== null && (
              <Text style={[styles.subtitle, { color: c.mutedForeground }]}>
                IMC {bmi.toFixed(1)} · {bmiLabel(bmi)}
              </Text>
            )}
          </View>
        </View>

        <Animated.View entering={FadeInDown.duration(400)}>
          <Card>
            <Text style={[styles.cardTitle, { color: c.foreground }]}>
              Seus dados
            </Text>
            <Field
              label="Nome"
              value={name}
              onChangeText={setName}
              placeholder="Como tu chama?"
            />
            <View style={styles.row}>
              <Field
                label="Altura (cm)"
                value={height}
                onChangeText={setHeight}
                placeholder="175"
                keyboardType="numeric"
                style={{ flex: 1 }}
              />
              <Field
                label="Peso (kg)"
                value={weight}
                onChangeText={setWeight}
                placeholder="72"
                keyboardType="numeric"
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(400)}>
          <Card>
            <Text style={[styles.cardTitle, { color: c.foreground }]}>Metas diárias</Text>
            <View style={styles.row}>
              <Field
                label="Calorias (kcal)"
                value={calorieGoal}
                onChangeText={setCalorieGoal}
                placeholder="2000"
                keyboardType="numeric"
                style={{ flex: 1 }}
              />
              <Field
                label="Água (litros)"
                value={waterGoalL}
                onChangeText={setWaterGoalL}
                placeholder="2.5"
                keyboardType="numeric"
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(400)}>
          <Card>
            <View style={styles.themeRow}>
              <View style={styles.themeLabelRow}>
                <View style={[styles.iconBubble, { backgroundColor: c.muted }]}>
                  <Feather
                    name={theme === "dark" ? "moon" : "sun"}
                    size={16}
                    color={c.foreground}
                  />
                </View>
                <View>
                  <Text style={[styles.themeTitle, { color: c.foreground }]}>
                    Modo escuro
                  </Text>
                  <Text style={[styles.themeSubtitle, { color: c.mutedForeground }]}>
                    Olhinho descansado de noite
                  </Text>
                </View>
              </View>
              <Switch
                value={theme === "dark"}
                onValueChange={toggleTheme}
                trackColor={{ true: c.primary, false: c.border }}
                thumbColor="#fff"
              />
            </View>
          </Card>
        </Animated.View>

        <TouchableOpacity
          onPress={onSave}
          style={[
            styles.saveBtn,
            { backgroundColor: c.primary, borderRadius: c.radius },
          ]}
        >
          <Text
            style={{
              color: c.primaryForeground,
              fontFamily: "Inter_700Bold",
              fontSize: 15,
            }}
          >
            Salvar perfil
          </Text>
        </TouchableOpacity>

        {saved && (
          <Animated.View
            entering={FadeIn}
            style={[styles.savedToast, { backgroundColor: c.success }]}
          >
            <Feather name="check" size={16} color="#fff" />
            <Text style={{ color: "#fff", fontFamily: "Inter_700Bold", fontSize: 13 }}>
              Boa! Perfil salvo!
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric";
  style?: object;
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  style,
}: FieldProps) {
  const c = useColors();
  return (
    <View style={[styles.field, style]}>
      <Text style={[styles.fieldLabel, { color: c.mutedForeground }]}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.mutedForeground}
        keyboardType={keyboardType}
        style={[
          styles.fieldInput,
          {
            color: c.foreground,
            backgroundColor: c.muted,
            borderRadius: 12,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 22, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_500Medium", marginTop: 4 },
  cardTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 8 },
  row: { flexDirection: "row", gap: 10 },
  field: { marginTop: 12 },
  fieldLabel: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  fieldInput: {
    height: 46,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  themeLabelRow: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  themeTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  themeSubtitle: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 2 },
  saveBtn: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  savedToast: {
    position: "absolute",
    bottom: 120,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
});
