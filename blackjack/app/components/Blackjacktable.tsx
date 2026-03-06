"use client";

import {useEffect, useState} from "react";
import {Card} from "../../../src/types/cards";
import {newShuffledDeck, drawCards, CARD_BACK_IMAGE} from "../../../src/types/api/deckApi";

export default function BlackjackTable() {
  const [isLoading, setIsLoading] = useState(false);
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);

  async function startGame() {
    setIsLoading(true);
    const deck = await newShuffledDeck(6);
    const drawn = await drawCards(deck.deck_id, 4);
    const [p1, d1, p2, d2] = drawn.cards;
    setPlayerCards([p1, p2]);
    setDealerCards([d1, d2]);
    setIsLoading(false);
  }

  useEffect(() => {
    startGame();
  }, []);

  return ( 
  <div className="flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <p className="font-serif text-2xl font-bold tracking-widest uppercase text-yellow-400/50">
          Blackjack Pays 3 to 2
        </p>
        <p className="font-serif text-xs tracking-widest uppercase text-yellow-400/35">
          Dealer must draw to 16 and stand on all 17s
        </p>
      </div>

      {isLoading ? (
        <p className="font-serif text-white/50 tracking-widest uppercase text-sm">Dealing...</p>
      ) : (
        <div className="flex flex-col items-center gap-16">
          <div className="flex flex-col items-center gap-3">
            <p className="font-serif text-xs tracking-widest uppercase text-white/40">Dealer</p>
            <div className="flex gap-3">
              {dealerCards.map((card, i) => (
                <img
                  key={card.code}
                  src={i === 1 ? CARD_BACK_IMAGE : card.image}
                  alt={i === 1 ? "Hidden card" : `${card.value} of ${card.suit}`}
                  className="w-20 h-28 rounded-md shadow-lg"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-3">
              {playerCards.map((card) => (
                <img
                  key={card.code}
                  src={card.image}
                  alt={`${card.value} of ${card.suit}`}
                  className="w-20 h-28 rounded-md shadow-lg"
                />
              ))}
            </div>
            <p className="font-serif text-xs tracking-widest uppercase text-white/40">Player</p>
          </div>
        </div>
      )}

      <button
        onClick={startGame}
        disabled={isLoading}
        className="mt-4 px-8 py-3 bg-yellow-400/80 hover:bg-yellow-400 disabled:opacity-50 text-green-900 font-serif font-bold tracking-widest uppercase text-sm rounded transition-colors"
      >
        New Deal
      </button>
    </div>
  );
}
