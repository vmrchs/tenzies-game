import React from "react";
import "./App.css";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import ConfettiExplosion from "react-confetti-explosion";

function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [isExploding, setIsExploding] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [time, setTime] = React.useState(0);
  const [timerOn, setTimerOn] = React.useState(false);

  const NO_OF_HIGH_SCORES = 10;
  const HIGH_SCORES = "highScores";

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);

    if (allHeld && allSameValue) {
      setTenzies(true);
      setIsExploding(true);
      setTimerOn(false);
      checkHighScore(score);
      console.log("You won!");
    }
  }, [dice]);

  React.useEffect(() => {
    let interval = null;

    if (timerOn) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1000);
      });
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerOn]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    // console.log(newDice);

    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setScore(score + 1);
    } else {
      setTenzies(false);
      setIsExploding(false);
      setScore(0);
      setTime(0);
      setDice(allNewDice());
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  function checkHighScore(score) {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
    const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;

    if (score > lowestScore) {
      saveHighScore(score, highScores); // TODO
      showHighScores(); // TODO
    }
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      id={die.id}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {isExploding && <ConfettiExplosion />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice show the same number. Click each die to freeze it at
        its current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <div className="score">
        <h3 className="time">TIME: {time}</h3>
        <h3>ROLLS: {score}</h3>
      </div>
      <button onClick={rollDice} className="roll-dice">
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}

export default App;
