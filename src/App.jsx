import React from "react";
import "./App.css";
import Die from "./components/Die";

function App() {
  const [dice, setDice] = React.useState(allNewDice());

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      let randomNumber = Math.ceil(Math.random() * 6);
      newDice.push(randomNumber);
    }
    // console.log(newDice);
    return newDice;
  }

  function rollDice() {
    setDice(allNewDice());
  }

  const diceElements = dice.map((die) => <Die value={die} />);

  return (
    <main>
      <div className="dice-container">{diceElements}</div>
      <button onClick={rollDice} className="roll-dice">
        Roll
      </button>
    </main>
  );
}

export default App;
