import React, { useState, useEffect } from "react";
import Die from "../components/Die";
import { RollPoints } from "../types/types";
import ScoreTable from "../components/ScoreTable";

const rollPointsDefault = {
  ones: 0,
  twos: 0,
  threes: 0,
  fours: 0,
  fives: 0,
  sixes: 0,
  threeOAK: 0,
  fourOAK: 0,
  fullHouse: 0,
  smallS: 0,
  largeS: 0,
  chance: 0,
  yahtzee: 0,
};

const diceDefault = [
  { number: 1, string: "one", selected: false },
  { number: 2, string: "two", selected: false },
  { number: 3, string: "three", selected: false },
  { number: 4, string: "four", selected: false },
  { number: 5, string: "five", selected: false },
];

const maxRolls = 3;

function App() {
  const [dice, setDice] = useState(diceDefault);
  const [rollsLeft, setRollsLeft] = useState<number>(maxRolls);
  const [roll, setRoll] = useState<never[] | number[]>([]);
  const [rollPoints, setRollPoints] = useState<RollPoints>(rollPointsDefault);

  useEffect(() => {
    if (roll.length) {
      console.log("roll", roll);
      calculatePoints(rollPoints, roll);
      console.log("rollPoints", rollPoints);
    }
  }, [dice, roll, rollPoints]);

  function calculatePoints(rollPoints, roll) {
    // TODO: The logic needs to be improved, it's not working
    const sortedRoll = roll.sort();
    const joinedRoll = sortedRoll.join("");
    if (/(.)\1{4}/.test(joinedRoll)) {
      console.log("Five of a Kind");
    } else if (/(.)\1{3}/.test(joinedRoll)) {
      console.log("Four of a Kind");
    } else if (/(.)\1{2}(.)\2|(.)\3(.)\4{2}/.test(joinedRoll)) {
      console.log("Full House");
    } else if (/(.)\1{2}/.test(joinedRoll)) {
      console.log("Three of a Kind");
    } else if (/1234|2345|3456/.test(joinedRoll.replace(/(.)\1/, "$1"))) {
      console.log("Small Straight");
    } else if (/12345|23456/.test(joinedRoll.replace(/(.)\1/, "$1"))) {
      console.log("Large Straight");
    }
  }

  function toggleSelected(number: number) {
    if (rollsLeft) {
      const newDice = dice.map((die) => {
        if (die.number === number) {
          return { ...die, selected: !die.selected };
        }
        return die;
      });
      setDice(newDice);
    }
  }

  function rollDice() {
    if (rollsLeft) {
      let rollArr = [];
      // FIXME: Maybe we need to use the roll from the state
      for (let k = 1; k <= dice.length; k++) {
        if (!dice[k - 1].selected) {
          let die = document.getElementById(`dice${k}`);
          let diceRoll = Math.floor(Math.random() * 6 + 1);
          rollArr.push(diceRoll);
          for (let i = 1; i <= 6; i++) {
            die?.classList.remove("show-" + i);
            // Trying to animate same roll
            // if (i !== 6) {
            //   die?.classList.add("show-" + (i + 1));
            //   die?.classList.remove("show-" + (i + 1));
            // } else {
            //   die?.classList.add("show-" + (i - 1));
            //   die?.classList.remove("show-" + (i - 1));
            // }
            if (diceRoll === i) {
              die?.classList.add("show-" + i);
            }
          }
        }
      }
      setRoll(rollArr);
      setRollsLeft((prevRolls) => prevRolls - 1);
    }
  }

  function resetGame() {
    setDice(diceDefault);
    setRollsLeft(maxRolls);
    setRoll([]);
    setRollPoints(rollPointsDefault);
  }

  console.log("roll", roll);

  return (
    <div className="App flex flex-col justify-center items-center">
      <div
        className="
      rounded-lg 
      w-full lg:w-5/6 xl:w-3/5
      h-full lg:h-[95%] 
      bg-basic-white"
      >
        <div className="lg:rounded-t-lg bg-gradient-to-r from-teal-blue to-teal-dark xs:p-[12px] md:p-[20px] lg:p-[50px]">
          <div className="flex justify-center items-center my-10">
            <div
              className={`opacity-${
                rollsLeft - 3
              } container flex justify-between`}
            >
              {dice.map((die) => (
                <Die
                  key={die.number}
                  nameN={die.number}
                  nameS={die.string}
                  selected={die.selected}
                  onClick={toggleSelected}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="roll-button m-5 w-100% flex justify-between">
          <button
            onClick={rollDice}
            className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded w-[49%] disabled:opacity-[0.3] disabled:bg-orange-400"
            disabled={!rollsLeft}
          >
            <span className="flex justify-between">
              <span>Roll dice</span>
              <span className="bg-white w-[24px] h-[24px] rounded-full text-orange-500 font-[900] ">
                {rollsLeft}
              </span>
            </span>
          </button>
          <button
            onClick={() => console.log("Played")}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-[0.3] disabled:bg-emerald-500 text-white font-bold py-2 px-4 rounded w-[49%]"
          >
            Play
          </button>
        </div>
        <div className="px-[20px]">
          <ScoreTable rollPoints={rollPoints} />
        </div>
        <button
          onClick={resetGame}
          className="bg-red-500 hover:bg-red-600 disabled:opacity-[0.4] text-white font-bold py-2 px-4 rounded w-[49%]"
        >
          Start all over!
        </button>
      </div>
    </div>
  );
}

export default App;
