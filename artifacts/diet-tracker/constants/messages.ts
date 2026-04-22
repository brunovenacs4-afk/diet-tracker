export function getCalorieMessage(consumed: number, goal: number): string {
  if (goal <= 0) return "Define a meta aí, monstro!";
  const pct = consumed / goal;
  if (pct === 0) return "Bora começar o dia, gigante!";
  if (pct < 0.25) return "Tá só esquentando, segue firme!";
  if (pct < 0.5) return "Tá mandando bem, meu patrão!";
  if (pct < 0.75) return "Segue firme, monstro!";
  if (pct < 1) return "Hoje tá voando! Quase lá!";
  if (pct <= 1.1) return "Meta batida! Tá fazendo história!";
  return "Calma no doce, campeão. Já passou da meta!";
}

export function getWaterMessage(consumed: number, goal: number): string {
  if (goal <= 0) return "Define quanta água quer beber, parceiro!";
  const pct = consumed / goal;
  if (pct === 0) return "Bora beber água, campeão!";
  if (pct < 0.33) return "Hidrata aí, não vacila!";
  if (pct < 0.66) return "Tá no caminho, segue firme!";
  if (pct < 1) return "Quase lá, não vacila!";
  return "Hidratação tá em dia! Aí sim!";
}

export function getTimeOfDayMessage(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia! Bora começar com um copão d'água ☉";
  if (h < 18) return "Boa tarde! Não esquece da hidratação no meio do dia";
  return "Boa noite! Beber água também conta antes de dormir";
}

export function getRandomFeedback(): string {
  const opts = [
    "Boa! Registrado!",
    "Aí sim, hidratando!",
    "Vai perdendo medida aí, gigante!",
    "Mais um pra conta!",
    "Tá voando hoje!",
  ];
  return opts[Math.floor(Math.random() * opts.length)] ?? opts[0]!;
}
