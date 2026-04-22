import type { Feather } from "@expo/vector-icons";

export interface WorkoutType {
  id: string;
  name: string;
  met: number;
  icon: keyof typeof Feather.glyphMap;
}

export const WORKOUT_TYPES: WorkoutType[] = [
  { id: "w1", name: "Caminhada leve", met: 3.5, icon: "navigation" },
  { id: "w2", name: "Caminhada rápida", met: 4.5, icon: "navigation" },
  { id: "w3", name: "Corrida leve", met: 7, icon: "wind" },
  { id: "w4", name: "Corrida moderada", met: 9.8, icon: "wind" },
  { id: "w5", name: "Corrida forte", met: 11.5, icon: "wind" },
  { id: "w6", name: "Bicicleta lazer", met: 5, icon: "circle" },
  { id: "w7", name: "Bicicleta moderada", met: 7, icon: "circle" },
  { id: "w8", name: "Bicicleta intensa", met: 10, icon: "circle" },
  { id: "w9", name: "Natação leve", met: 6, icon: "droplet" },
  { id: "w10", name: "Natação intensa", met: 9.8, icon: "droplet" },
  { id: "w11", name: "Musculação", met: 5, icon: "shield" },
  { id: "w12", name: "CrossFit", met: 8, icon: "zap" },
  { id: "w13", name: "Funcional", met: 6, icon: "zap" },
  { id: "w14", name: "HIIT", met: 9, icon: "zap" },
  { id: "w15", name: "Yoga", met: 3, icon: "feather" },
  { id: "w16", name: "Pilates", met: 3.5, icon: "feather" },
  { id: "w17", name: "Alongamento", met: 2.3, icon: "feather" },
  { id: "w18", name: "Futebol", met: 8, icon: "target" },
  { id: "w19", name: "Basquete", met: 7, icon: "target" },
  { id: "w20", name: "Vôlei", met: 4, icon: "target" },
  { id: "w21", name: "Tênis", met: 7, icon: "target" },
  { id: "w22", name: "Boxe", met: 9, icon: "shield" },
  { id: "w23", name: "Muay Thai", met: 10, icon: "shield" },
  { id: "w24", name: "Jiu-Jitsu", met: 10, icon: "shield" },
  { id: "w25", name: "Dança", met: 5, icon: "music" },
  { id: "w26", name: "Zumba", met: 7.5, icon: "music" },
  { id: "w27", name: "Pular corda", met: 11, icon: "activity" },
  { id: "w28", name: "Spinning", met: 8.5, icon: "circle" },
  { id: "w29", name: "Esteira inclinada", met: 6, icon: "trending-up" },
  { id: "w30", name: "Subir escada", met: 8, icon: "trending-up" },
  { id: "w31", name: "Surf", met: 5, icon: "wind" },
  { id: "w32", name: "Skate", met: 5, icon: "wind" },
  { id: "w33", name: "Patinação", met: 7, icon: "wind" },
  { id: "w34", name: "Escalada", met: 8, icon: "trending-up" },
  { id: "w35", name: "Caminhada com cachorro", met: 3, icon: "navigation" },
  { id: "w36", name: "Trabalho doméstico", met: 3, icon: "home" },
];

/**
 * Calorias queimadas = MET × peso(kg) × tempo(horas)
 */
export function calculateBurned(
  met: number,
  weightKg: number,
  minutes: number,
): number {
  if (weightKg <= 0 || minutes <= 0) return 0;
  return Math.round(met * weightKg * (minutes / 60));
}
