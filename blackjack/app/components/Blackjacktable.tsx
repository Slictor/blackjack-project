"use client";

import {useEffect, useState} from "react";
import {Card} from "../types/cards";
import {newShuffledDeck, drawCards, CARD_BACK_IMAGE} from "../types/api/deckApi";
import {calculateScore, isBlackjack} from "./ScoreCalculator";
import {evaluateOutcome, GameOutcome} from "./OutcomeEvaluator";

export default function BlackjackTable() {
  const [deckId, setDeckId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [outcome, setOutcome] = useState<GameOutcome | null>(null);
  const [dealerRevealed, setDealerRevealed] = useState(false);

  async function startGame() {
    setIsLoading(true);
    setOutcome(null);
    setDealerRevealed(false);
    
    const deck = await newShuffledDeck(6);
    setDeckId(deck.deck_id);
    
    const drawn = await drawCards(deck.deck_id, 4);
    const [p1, d1, p2, d2] = drawn.cards;
    
    const initialPlayerCards = [p1, p2];
    const initialDealerCards = [d1, d2];

    setPlayerCards(initialPlayerCards);
    setDealerCards(initialDealerCards);

    if (isBlackjack(initialPlayerCards)) {
      setOutcome("blackjack");
      setDealerRevealed(true);
    }

    setIsLoading(false);
  }

  async function hit() {
    if (!deckId || outcome) return;
    const drawn = await drawCards(deckId, 1);
    const newCard = drawn.cards[0];
    const newPlayerCards = [...playerCards, newCard];
    setPlayerCards(newPlayerCards);

    const newScore = calculateScore(newPlayerCards);
    if (newScore > 21) {
      setOutcome("bust");
    } else if (newScore === 21) {
  await revealAndEvaluate(newPlayerCards);
    }
  }

  async function stand() {
    if (!deckId || outcome) return;
    await revealAndEvaluate(playerCards);
  }

  async function revealAndEvaluate (finalPlayerCards: Card[]) {
    if (!deckId) return;
    setDealerRevealed(true);

    let currentDealerCards = [...dealerCards];
    let dealerScore = calculateScore(currentDealerCards);

    while (dealerScore < 17) {
      const drawn = await drawCards(deckId, 1);
      currentDealerCards = [...currentDealerCards, drawn.cards[0]];
      dealerScore = calculateScore(currentDealerCards);
    }

    setDealerCards(currentDealerCards);

    const playerScore = calculateScore(finalPlayerCards);
    setOutcome(evaluateOutcome(playerScore, dealerScore));
  }
  useEffect(() => {
    startGame();
  }, []);

const playerScore = calculateScore(playerCards);
const dealerVisibleScore = dealerRevealed
  ? calculateScore(dealerCards)
  : calculateScore([dealerCards[0]].filter(Boolean));

  const gameOver = outcome !== null;

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
            <div className="flex items-center gap-3">
              <p className="font-serif text-xs tracking-widest uppercase text-white/40">Dealer</p>
              <p className="font-serif text-sm font-bold text-white/60">{dealerVisibleScore}</p>
            </div>
            <div className="flex gap-3">
              {dealerCards.map((card, i) => (
                <img
                  key={`${card.code}-${i}`}
                  src={!dealerRevealed && i === 1 ? CARD_BACK_IMAGE : card.image}
                  alt={!dealerRevealed && i === 1 ? "Hidden card" : `${card.value} of ${card.suit}`}
                  className="w-20 h-28 rounded-md shadow-lg"
                />
              ))}
            </div>
          </div>

          {outcome && (
            <p className="font-serif text-2xl font-bold tracking-widest uppercase text-yellow-400">
              {outcome === "blackjack" && "Blackjack!"}
              {outcome === "win" && "You Win!"}
              {outcome === "lose" && "Dealer Wins"}
              {outcome === "bust" && "Bust!"}
              {outcome === "push" && "Push"}
            </p>
          )}

          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-3">
              {playerCards.map((card, i) => (
                <img
                  key={`${card.code}-${i}`}
                  src={card.image}
                  alt={`${card.value} of ${card.suit}`}
                  className="w-20 h-28 rounded-md shadow-lg"
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <p className="font-serif text-xs tracking-widest uppercase text-white/40">Player</p>
              <p className="font-serif text-sm font-bold text-white/60">{playerScore}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-4">
        {!gameOver && !isLoading && (
          <>
            <button
              onClick={hit}
              className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-serif font-bold tracking-widest uppercase text-sm rounded transition-colors"
            >
              Hit
            </button>
            <button
              onClick={stand}
              className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-serif font-bold tracking-widest uppercase text-sm rounded transition-colors"
            >
              Stand
            </button>
          </>
        )}
        {gameOver && (
          <button
            onClick={startGame}
            className="px-8 py-3 bg-yellow-400/80 hover:bg-yellow-400 text-green-900 font-serif font-bold tracking-widest uppercase text-sm rounded transition-colors"
          >
            New Deal
          </button>
        )}
      </div>
    </div>
  );
}