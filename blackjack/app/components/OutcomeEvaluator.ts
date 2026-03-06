export type GameOutcome = "blackjack" | "win" | "lose" | "push" | "bust";

export function evaluateOutcome(playerScore: number, dealerScore: number): GameOutcome {
  if (playerScore > 21) return "bust";
  if (playerScore ===21) return "blackjack";
  if (dealerScore > 21) return "win";
  if (playerScore > dealerScore) return "win";
  if (playerScore < dealerScore) return "lose";
  return "push";
}