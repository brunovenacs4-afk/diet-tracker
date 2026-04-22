import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface Props {
  icon?: keyof typeof Feather.glyphMap;
  title?: string;
  subtitle?: string;
}

export function EmptyState({
  icon = "inbox",
  title = "Nada por aqui ainda",
  subtitle = "Bora começar?",
}: Props) {
  const c = useColors();
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: c.muted }]}>
        <Feather name={icon} size={28} color={c.mutedForeground} />
      </View>
      <Text style={[styles.title, { color: c.foreground }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: c.mutedForeground }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 36, gap: 8 },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
