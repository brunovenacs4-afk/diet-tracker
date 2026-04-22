import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

import { useColors } from "@/hooks/useColors";

export function Card({ style, children, ...rest }: ViewProps) {
  const c = useColors();
  return (
    <View
      {...rest}
      style={[
        styles.card,
        {
          backgroundColor: c.card,
          borderRadius: c.radius,
          shadowColor: c.foreground,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
});
