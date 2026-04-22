import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Theme = "light" | "dark";

export interface Profile {
  name: string;
  height: number;
  weight: number;
  calorieGoal: number;
  waterGoal: number;
}

export interface Meal {
  id: string;
  foodId: string;
  foodName: string;
  category: string;
  measure: string;
  amount: number;
  grams: number;
  calories: number;
  date: string;
  mealType: "cafe" | "almoco" | "jantar" | "lanche";
}

export interface WaterLog {
  id: string;
  ml: number;
  date: string;
  time: string;
}

export interface DietPlanItem {
  id: string;
  text: string;
}

export interface DietPlan {
  cafe: DietPlanItem[];
  almoco: DietPlanItem[];
  jantar: DietPlanItem[];
  lanche: DietPlanItem[];
}

interface AppState {
  theme: Theme;
  profile: Profile;
  meals: Meal[];
  waterLogs: WaterLog[];
  dietPlan: DietPlan;
  ready: boolean;
  toggleTheme: () => void;
  setProfile: (p: Profile) => void;
  addMeal: (m: Omit<Meal, "id" | "date"> & { date?: string }) => void;
  removeMeal: (id: string) => void;
  updateMeal: (id: string, patch: Partial<Meal>) => void;
  addWater: (ml: number) => void;
  removeWater: (id: string) => void;
  updateWater: (id: string, ml: number) => void;
  addDietItem: (mealType: keyof DietPlan, text: string) => void;
  removeDietItem: (mealType: keyof DietPlan, id: string) => void;
}

const STORAGE_KEY = "@diet_tracker_state_v1";

const DEFAULT_PROFILE: Profile = {
  name: "",
  height: 0,
  weight: 0,
  calorieGoal: 2000,
  waterGoal: 2500,
};

const DEFAULT_DIET: DietPlan = {
  cafe: [],
  almoco: [],
  jantar: [],
  lanche: [],
};

const AppContext = createContext<AppState | null>(null);

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [profile, setProfileState] = useState<Profile>(DEFAULT_PROFILE);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [dietPlan, setDietPlan] = useState<DietPlan>(DEFAULT_DIET);
  const [ready, setReady] = useState(false);

  // Load from storage
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.theme) setTheme(parsed.theme);
          if (parsed.profile) setProfileState({ ...DEFAULT_PROFILE, ...parsed.profile });
          if (Array.isArray(parsed.meals)) setMeals(parsed.meals);
          if (Array.isArray(parsed.waterLogs)) setWaterLogs(parsed.waterLogs);
          if (parsed.dietPlan) setDietPlan({ ...DEFAULT_DIET, ...parsed.dietPlan });
        }
      } catch {
        // ignore
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // Persist
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ theme, profile, meals, waterLogs, dietPlan }),
    ).catch(() => {});
  }, [ready, theme, profile, meals, waterLogs, dietPlan]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  const setProfile = useCallback((p: Profile) => setProfileState(p), []);

  const addMeal = useCallback<AppState["addMeal"]>((m) => {
    setMeals((prev) => [
      {
        ...m,
        id: genId(),
        date: m.date ?? todayStr(),
      } as Meal,
      ...prev,
    ]);
  }, []);

  const removeMeal = useCallback((id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const updateMeal = useCallback((id: string, patch: Partial<Meal>) => {
    setMeals((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }, []);

  const addWater = useCallback((ml: number) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setWaterLogs((prev) => [
      { id: genId(), ml, date: todayStr(), time },
      ...prev,
    ]);
  }, []);

  const removeWater = useCallback((id: string) => {
    setWaterLogs((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const updateWater = useCallback((id: string, ml: number) => {
    setWaterLogs((prev) => prev.map((w) => (w.id === id ? { ...w, ml } : w)));
  }, []);

  const addDietItem = useCallback((mealType: keyof DietPlan, text: string) => {
    setDietPlan((prev) => ({
      ...prev,
      [mealType]: [...prev[mealType], { id: genId(), text }],
    }));
  }, []);

  const removeDietItem = useCallback((mealType: keyof DietPlan, id: string) => {
    setDietPlan((prev) => ({
      ...prev,
      [mealType]: prev[mealType].filter((i) => i.id !== id),
    }));
  }, []);

  const value = useMemo<AppState>(
    () => ({
      theme,
      profile,
      meals,
      waterLogs,
      dietPlan,
      ready,
      toggleTheme,
      setProfile,
      addMeal,
      removeMeal,
      updateMeal,
      addWater,
      removeWater,
      updateWater,
      addDietItem,
      removeDietItem,
    }),
    [
      theme,
      profile,
      meals,
      waterLogs,
      dietPlan,
      ready,
      toggleTheme,
      setProfile,
      addMeal,
      removeMeal,
      updateMeal,
      addWater,
      removeWater,
      updateWater,
      addDietItem,
      removeDietItem,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function caloriesForDate(meals: Meal[], date: string): number {
  return meals.filter((m) => m.date === date).reduce((s, m) => s + m.calories, 0);
}

export function waterForDate(logs: WaterLog[], date: string): number {
  return logs.filter((w) => w.date === date).reduce((s, w) => s + w.ml, 0);
}

export function last7Days(): string[] {
  const out: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
    );
  }
  return out;
}

export function calculateStreak(logs: WaterLog[], goal: number): number {
  if (goal <= 0) return 0;
  let streak = 0;
  const d = new Date();
  // Don't break streak if today's not done; check yesterday backwards if today < goal
  const today = todayStr();
  if (waterForDate(logs, today) >= goal) {
    streak = 1;
    d.setDate(d.getDate() - 1);
  } else {
    d.setDate(d.getDate() - 1);
  }
  while (true) {
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (waterForDate(logs, dateStr) >= goal) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
    if (streak > 365) break;
  }
  return streak;
}
