export interface CardImages {
  svg: string;
  png: string;
}

export interface Card {
  code: string;
  image: string;
  images: CardImages;
  value: string;
  suit: string;
}

export interface DeckResponse {
  success: boolean;
  deck_id: string;
  shuffled: boolean;
  remaining: number;
}

export interface DrawCardResponse {
  success: boolean;
  cards: Card[];
  deck_id: string;
  remaining: number;
}