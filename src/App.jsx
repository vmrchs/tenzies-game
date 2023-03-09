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
  const [highScore, setHighScore] = React.useState(
    parseInt(localStorage.getItem("highScore")) || 0
  );
  const [time, setTime] = React.useState(0);

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);

    if (allHeld && allSameValue) {
      setTenzies(true);
      setIsExploding(true);
      console.log("You won!");
    }
  }, [dice]);

  React.useEffect(() => {
    localStorage.setItem("highScore", highScore.toString());
  }, [highScore]);

  React.useEffect(() => {
    if (!tenzies) {
      setTimeout(() => setTime(time + 1), 1000);
    }

    return clearInterval(time);
  }, [time]);

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
      setScore(score + 1);
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      if (!highScore || score < highScore) {
        setHighScore(score);
      }

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
      <div className="scoreContainer">
        <h3 className="time">TIME: {time}</h3>
        <h3 className="score">ROLLS: {score}</h3>
        {highScore ? <h3>HIGH SCORE: {highScore}</h3> : ""}
      </div>
      <button onClick={rollDice} className="roll-dice">
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}

export default App;
