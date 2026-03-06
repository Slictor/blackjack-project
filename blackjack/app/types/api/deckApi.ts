import { DeckResponse, DrawCardResponse } from "../cards";

const BASE_URL = "https://deckofcardsapi.com/api/deck";

export const CARD_BACK_IMAGE = "https://deckofcardsapi.com/static/img/back.png";

export async function newShuffledDeck(deckCOunt = 6): Promise<DeckResponse> {
  const res = await fetch(`${BASE_URL}/new/shuffle/?deck_count=${deckCOunt}`);
  return res.json();
}

export async function drawCards(deckId: string, count = 1): Promise<DrawCardResponse> {
  const res = await fetch(`${BASE_URL}/${deckId}/draw/?count=${count}`);
  return res.json();
}