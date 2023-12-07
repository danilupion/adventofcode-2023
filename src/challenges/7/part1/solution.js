import { readLines } from "../../../common/files.js";
import { join } from "path";

const __dirname = new URL(".", import.meta.url).pathname;

const score = "23456789TJQKA";

const getScore = (card) => {
  return score.indexOf(card) + 1;
};

const hands = (await readLines(join(__dirname, "./input.txt")))
  .map((line) => {
    const [cards, bid] = line.split(" ");
    const uniqueCards = new Set(cards.split(""));
    const hand = Array.from(uniqueCards).map((card) => {
      const count = cards.split("").filter((c) => c === card).length;
      const weight = Math.pow(10, count - 1);
      const score = getScore(card);
      return {
        card,
        score,
        count,
        weight,
      };
    });

    return {
      cards,
      hand,
      bid: parseInt(bid),
      weight: hand.reduce((acc, card) => acc + card.weight, 0),
    };
  })
  .sort((a, b) => {
    if (a.weight !== b.weight) {
      return b.weight - a.weight;
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
