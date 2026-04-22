export type FoodCategory =
  | "carboidratos"
  | "proteinas"
  | "gorduras"
  | "frutas"
  | "bebidas"
  | "industrializados"
  | "vegetais";

export type Measure =
  | "gramas"
  | "colher_sopa"
  | "colher_cha"
  | "concha"
  | "xicara"
  | "unidade"
  | "fatia"
  | "copo";

export interface Food {
  id: string;
  name: string;
  kcalPer100g: number;
  category: FoodCategory;
  unitGrams?: number;
}

export const MEASURE_LABELS: Record<Measure, string> = {
  gramas: "g",
  colher_sopa: "colher (sopa)",
  colher_cha: "colher (chá)",
  concha: "concha",
  xicara: "xícara",
  unidade: "unidade",
  fatia: "fatia",
  copo: "copo (200ml)",
};

export const MEASURE_GRAMS: Record<Measure, number> = {
  gramas: 1,
  colher_sopa: 15,
  colher_cha: 5,
  concha: 80,
  xicara: 120,
  unidade: 100,
  fatia: 30,
  copo: 200,
};

export const FOODS: Food[] = [
  // Carboidratos
  { id: "f1", name: "Arroz branco cozido", kcalPer100g: 130, category: "carboidratos" },
  { id: "f2", name: "Arroz integral cozido", kcalPer100g: 124, category: "carboidratos" },
  { id: "f3", name: "Macarrão cozido", kcalPer100g: 158, category: "carboidratos" },
  { id: "f4", name: "Batata cozida", kcalPer100g: 87, category: "carboidratos" },
  { id: "f5", name: "Batata doce cozida", kcalPer100g: 86, category: "carboidratos" },
  { id: "f6", name: "Mandioca cozida", kcalPer100g: 125, category: "carboidratos" },
  { id: "f7", name: "Pão francês", kcalPer100g: 270, category: "carboidratos", unitGrams: 50 },
  { id: "f8", name: "Pão de forma", kcalPer100g: 253, category: "carboidratos", unitGrams: 25 },
  { id: "f9", name: "Tapioca", kcalPer100g: 240, category: "carboidratos" },
  { id: "f10", name: "Aveia", kcalPer100g: 389, category: "carboidratos" },
  { id: "f11", name: "Granola", kcalPer100g: 471, category: "carboidratos" },
  { id: "f12", name: "Farinha de trigo", kcalPer100g: 360, category: "carboidratos" },

  // Proteínas
  { id: "f13", name: "Frango grelhado", kcalPer100g: 165, category: "proteinas" },
  { id: "f14", name: "Carne bovina (patinho)", kcalPer100g: 250, category: "proteinas" },
  { id: "f15", name: "Carne moída", kcalPer100g: 217, category: "proteinas" },
  { id: "f16", name: "Filé de peixe (tilápia)", kcalPer100g: 96, category: "proteinas" },
  { id: "f17", name: "Salmão grelhado", kcalPer100g: 208, category: "proteinas" },
  { id: "f18", name: "Atum em lata", kcalPer100g: 116, category: "proteinas" },
  { id: "f19", name: "Ovo cozido", kcalPer100g: 155, category: "proteinas", unitGrams: 50 },
  { id: "f20", name: "Ovo mexido", kcalPer100g: 196, category: "proteinas", unitGrams: 60 },
  { id: "f21", name: "Feijão preto cozido", kcalPer100g: 132, category: "proteinas" },
  { id: "f22", name: "Lentilha cozida", kcalPer100g: 116, category: "proteinas" },
  { id: "f23", name: "Grão-de-bico cozido", kcalPer100g: 164, category: "proteinas" },
  { id: "f24", name: "Whey protein", kcalPer100g: 380, category: "proteinas" },

  // Gorduras
  { id: "f25", name: "Azeite de oliva", kcalPer100g: 884, category: "gorduras" },
  { id: "f26", name: "Manteiga", kcalPer100g: 717, category: "gorduras" },
  { id: "f27", name: "Castanha-do-pará", kcalPer100g: 656, category: "gorduras", unitGrams: 5 },
  { id: "f28", name: "Amendoim", kcalPer100g: 567, category: "gorduras" },
  { id: "f29", name: "Pasta de amendoim", kcalPer100g: 588, category: "gorduras" },
  { id: "f30", name: "Abacate", kcalPer100g: 160, category: "gorduras" },

  // Frutas
  { id: "f31", name: "Banana", kcalPer100g: 89, category: "frutas", unitGrams: 100 },
  { id: "f32", name: "Maçã", kcalPer100g: 52, category: "frutas", unitGrams: 150 },
  { id: "f33", name: "Laranja", kcalPer100g: 47, category: "frutas", unitGrams: 130 },
  { id: "f34", name: "Mamão", kcalPer100g: 43, category: "frutas" },
  { id: "f35", name: "Manga", kcalPer100g: 60, category: "frutas" },
  { id: "f36", name: "Morango", kcalPer100g: 32, category: "frutas" },
  { id: "f37", name: "Uva", kcalPer100g: 69, category: "frutas" },
  { id: "f38", name: "Melancia", kcalPer100g: 30, category: "frutas" },
  { id: "f39", name: "Abacaxi", kcalPer100g: 50, category: "frutas" },

  // Bebidas
  { id: "f40", name: "Leite integral", kcalPer100g: 61, category: "bebidas" },
  { id: "f41", name: "Leite desnatado", kcalPer100g: 35, category: "bebidas" },
  { id: "f42", name: "Iogurte natural", kcalPer100g: 61, category: "bebidas" },
  { id: "f43", name: "Suco de laranja natural", kcalPer100g: 45, category: "bebidas" },
  { id: "f44", name: "Café preto sem açúcar", kcalPer100g: 2, category: "bebidas" },
  { id: "f45", name: "Refrigerante (cola)", kcalPer100g: 42, category: "bebidas" },
  { id: "f46", name: "Cerveja", kcalPer100g: 43, category: "bebidas" },

  // Industrializados
  { id: "f47", name: "Pizza (mussarela)", kcalPer100g: 266, category: "industrializados", unitGrams: 100 },
  { id: "f48", name: "Hambúrguer (lanche)", kcalPer100g: 295, category: "industrializados", unitGrams: 200 },
  { id: "f49", name: "Batata frita", kcalPer100g: 312, category: "industrializados" },
  { id: "f50", name: "Chocolate ao leite", kcalPer100g: 546, category: "industrializados" },
  { id: "f51", name: "Bolacha recheada", kcalPer100g: 471, category: "industrializados" },
  { id: "f52", name: "Salgadinho de pacote", kcalPer100g: 536, category: "industrializados" },
  { id: "f53", name: "Sorvete de creme", kcalPer100g: 207, category: "industrializados" },
  { id: "f54", name: "Coxinha", kcalPer100g: 271, category: "industrializados", unitGrams: 80 },

  // Vegetais
  { id: "f55", name: "Brócolis cozido", kcalPer100g: 35, category: "vegetais" },
  { id: "f56", name: "Alface", kcalPer100g: 15, category: "vegetais" },
  { id: "f57", name: "Tomate", kcalPer100g: 18, category: "vegetais" },
  { id: "f58", name: "Cenoura", kcalPer100g: 41, category: "vegetais" },
  { id: "f59", name: "Couve refogada", kcalPer100g: 60, category: "vegetais" },
  { id: "f60", name: "Abobrinha", kcalPer100g: 17, category: "vegetais" },
];

export function calculateCalories(
  food: Food,
  measure: Measure,
  amount: number,
): { calories: number; grams: number } {
  let grams: number;
  if (measure === "unidade" || measure === "fatia") {
    grams = (food.unitGrams ?? MEASURE_GRAMS[measure]) * amount;
  } else {
    grams = MEASURE_GRAMS[measure] * amount;
  }
  const calories = (food.kcalPer100g * grams) / 100;
  return { calories: Math.round(calories), grams: Math.round(grams) };
}

export const CATEGORY_LABELS: Record<FoodCategory, string> = {
  carboidratos: "Carboidratos",
  proteinas: "Proteínas",
  gorduras: "Gorduras",
  frutas: "Frutas",
  bebidas: "Bebidas",
  industrializados: "Industrializados",
  vegetais: "Vegetais",
};
