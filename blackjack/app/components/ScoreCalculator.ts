import {Card} from "../types/cards"

export function isBlackjack(cards: Card[]): boolean {
  if (cards.length !== 2) return false;
  return calculateScore(cards) === 21;
}

export function calculateScore(cards: Card[]): number {
  let score = 0;
  let aces = 0;

  for (const card of cards) {
    if (card.value === "ACE") {
      aces++;
      score += 11;
    } else if (["KING", "QUEEN", "JACK"].includes(card.value)) {
      score += 10;
    } else {
      score += parseInt(card.value);
    }
  }

  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }

  return score;
}