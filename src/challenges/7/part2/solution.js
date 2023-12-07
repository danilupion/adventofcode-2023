import { readLines } from "../../../common/files.js";
import { join } from "path";

const __dirname = new URL(".", import.meta.url).pathname;

const score = "J23456789TQKA";

const getScore = (card) => {
  return score.indexOf(card) + 1;
};

const hands = (await readLines(join(__dirname, "./input.txt")))
  .map((line) => {
    const [cards, bid] = line.split(" ");
    const uniqueCards = new Set(cards.split(""));
    const hand = Array.from(uniqueCards)
      .map((card) => {
        const count = cards.split("").filter((c) => c === card).length;
        const type = card === "J" ? 0 : Math.pow(10, count - 1);
        const score = getScore(card);
        return {
          card,
          score,
          count,
          type,
        };
      })
      .sort((a, b) => {
        return b.type - a.type;
      });

    const bestHand = hand[0];

    if (bestHand.card !== "J") {
      bestHand.type *= Math.pow(10, cards.split("J").length - 1);
    } else {
      bestHand.type = Math.pow(10, cards.split("J").length - 2);
    }

    return {
      cards,
      hand,
      bid: parseInt(bid),
      type: hand.reduce((acc, card) => acc + card.type, 0),
    };
  })
  .sort((a, b) => {
    if (a.type !== b.type) {
      return b.type - a.type;
    }
    for (let i = 0; i < a.cards.length; i++) {
      const aScore = getScore(a.cards[i]);
      const bScore = getScore(b.cards[i]);
      if (aScore !== bScore) {
        return bScore - aScore;
      }
    }
  })
  .map((hand, index, original) => {
    const rank = original.length - index;
    return {
      ...hand,
      rank,
      winning: hand.bid * rank,
    };
  });

console.log(hands.reduce((acc, hand) => acc + hand.winning, 0));
