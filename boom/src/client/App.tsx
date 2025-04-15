import { ReactElement, useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

const socket = io();

function App(): ReactElement {
  const [count, setCount] = useState<number>(0);

  useEffect((): void => {
    const handleCounterUpdate = (newCounter: number): void => {
      setCount(newCounter);
    };
    socket.on("counterUpdate", handleCounterUpdate);
    return undefined;
  }, []);

  const handleIncrement = (): void => {
    const newCounter: number = count + 1;
    socket.emit("counterUpdate", newCounter);
  };

  const handleDecrement = (): void => {
    const newCounter: number = count - 1;
    socket.emit("counterUpdate", newCounter);
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <p>Real-time Counter Demo</p>
      <div className="card">
        <button onClick={handleDecrement}>-</button>
        <span style={{ margin: "0 1rem" }}>count is {count}</span>
        <button onClick={handleIncrement}>+</button>
        <p>
          Edit <code>src/client/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
