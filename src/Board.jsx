import { useEffect, useState } from "react";
import Marked from "./Marked.jsx";
import "./Board.css";

function Board() {
  //  1 | 2 | 3
  // ----------
  //  4 | 5 | 6
  // ----------
  //  7 | 8 | 9
  const [boardValue, setBoardValue] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
    9: null,
  });

  const [isUserTurn, setIsUserTurn] = useState(true);
  const [isGameEnd, setIsGameEnd] = useState(false);

  const [message, setMessage] = useState("");

  const setMarkedValue = (position) => {
    // return function to set new board value at specific position
    return (value) => {
      console.log({ position, value });
      setBoardValue((prev) => {
        let newBoardValue = { ...prev };
        newBoardValue[position] = value;
        // console.log({ prev, newBoardValue });
        return newBoardValue;
      });
    };
  };

  const allMarkedComponent = Array.from({ length: 9 }, (_, i) => i + 1).map(
    (position) => (
      <Marked
        key={position}
        value={boardValue[position]}
        setValue={setMarkedValue(position)}
        isDisable={isGameEnd || !isUserTurn}
        setIsUserTurn={setIsUserTurn}
      ></Marked>
    )
  );

  useEffect(() => {
    console.log("checking is game end");

    const availablePosition = Object.entries(boardValue)
      .filter(([, value]) => value === null)
      .map(([pos]) => pos);

    if (availablePosition.length >= 7) return;

    // SOMEONE WIN
    const checker = (a, b, c, marked) => {
      if (a === marked && a === b && a === c) return true;
    };

    for (const marked of ["O", "X"]) {
      console.log(`checking is ${marked} win`);
      if (
        checker(boardValue[1], boardValue[2], boardValue[3], marked) ||
        checker(boardValue[4], boardValue[5], boardValue[6], marked) ||
        checker(boardValue[7], boardValue[8], boardValue[9], marked) ||
        checker(boardValue[1], boardValue[4], boardValue[7], marked) ||
        checker(boardValue[2], boardValue[5], boardValue[8], marked) ||
        checker(boardValue[3], boardValue[6], boardValue[9], marked) ||
        checker(boardValue[1], boardValue[5], boardValue[9], marked) ||
        checker(boardValue[3], boardValue[5], boardValue[7], marked)
      ) {
        setIsGameEnd(true);
        setMessage(`"${marked}" WIN`);
        return;
      }
    }

    // DRAW
    if (availablePosition.length === 0) {
      setIsGameEnd(true);
      setMessage("DRAW");
      return;
    }
  }, [boardValue, isUserTurn, isGameEnd, setIsGameEnd]);

  // Random mark by computer
  useEffect(() => {
    if (isUserTurn || isGameEnd) return;

    // wait 500ms to feel more natural like the real opponent
    setTimeout(() => {
      console.log("random mark to board by computer");

      const availablePosition = Object.entries(boardValue)
        .filter(([, value]) => value === null)
        .map(([pos]) => pos);
      console.log(availablePosition);

      const randomIndex = Math.floor(Math.random() * availablePosition.length);
      const randomPosition = availablePosition[randomIndex];
      console.log({ randomIndex, randomPosition });

      setMarkedValue(randomPosition)("O");
      setIsUserTurn(true);
    }, 500);

    // TODO: add cleanup func
  }, [boardValue, isUserTurn, isGameEnd]);

  return (
    <>
      <h1>XO Board</h1>
      <div className="board">{allMarkedComponent}</div>
      <p>{message}</p>
    </>
  );
}

export default Board;
