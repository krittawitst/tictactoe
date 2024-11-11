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

  // Possible States: "userTurn", "processing", "botTurn", "gameEnd"
  const [state, setState] = useState("userTurn");

  // Possible Last Turn: "user", "bot"
  const [lastTurn, setLastTurn] = useState("user");

  const [message, setMessage] = useState("");

  // console.log("=".repeat(20));
  // console.log("rerender with state = ");
  // console.log({ state, lastTurn, message });

  const setMarkedValue = (position) => {
    // return function to set new board value at specific position
    return (value) => {
      // console.log({ position, value });
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
        setValue={(value) => {
          setMarkedValue(position)(value);
          setState("processing");
          setLastTurn("user");
        }}
        isDisable={state !== "userTurn"}
      ></Marked>
    )
  );

  useEffect(() => {
    if (state !== "processing") return;

    // console.log("checking is game end?");

    const checkIsGameEnd = () => {
      const availablePosition = Object.entries(boardValue)
        .filter(([, value]) => value === null)
        .map(([pos]) => pos);

      if (availablePosition.length >= 7) return false;

      // SOMEONE WIN
      const checker = (a, b, c, marked) => {
        if (a === marked && a === b && a === c) return true;
      };

      for (const marked of ["O", "X"]) {
        // console.log(`checking is ${marked} win?`);
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
          setMessage(`"${marked}" WIN`);
          return true;
        }
      }

      // DRAW
      if (availablePosition.length === 0) {
        setMessage("DRAW");
        return true;
      }

      return false;
    };

    const isGameEnd = checkIsGameEnd();

    if (isGameEnd) {
      setState("gameEnd");
    } else if (lastTurn === "user") {
      setState("botTurn");
    } else if (lastTurn === "bot") {
      setState("userTurn");
    } else {
      console.log("CODE SHOULD NOT REACH HERE");
    }
  }, [boardValue, state, lastTurn]);

  // Random mark by computer
  useEffect(() => {
    if (state !== "botTurn") return;

    // wait 500ms to feel more natural like the real opponent
    const timeoutId = setTimeout(() => {
      // console.log("random mark to board by computer");

      const availablePosition = Object.entries(boardValue)
        .filter(([, value]) => value === null)
        .map(([pos]) => pos);
      // console.log(availablePosition);

      const randomIndex = Math.floor(Math.random() * availablePosition.length);
      const randomPosition = availablePosition[randomIndex];
      // console.log({ randomPosition });

      setMarkedValue(randomPosition)("O");
      setState("processing");
      setLastTurn("bot");
    }, 500);

    // cleanup func
    return () => {
      // console.log(" cleanup func");
      clearTimeout(timeoutId);
    };
  }, [boardValue, state]);

  // Reset Board
  const resetBoard = () => {
    setBoardValue({
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
    setState("userTurn");
    setLastTurn("user");
    setMessage("");
  };

  return (
    <>
      <h1>OX Board</h1>
      <div className="board">{allMarkedComponent}</div>
      <p className="message">
        {message}
        {state === "gameEnd" && (
          <>
            <span className="separator"> | </span>
            <span className="reset" onClick={() => resetBoard()}>
              Restart
            </span>
          </>
        )}
      </p>
    </>
  );
}

export default Board;
