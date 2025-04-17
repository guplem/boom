import { useSyncState } from "@robojs/sync";
import { JSX } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

export function App(): JSX.Element {
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
      <p>Hello World!</p>
      <Counter />
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

function Counter(): JSX.Element {
  const [count, setCount] = useSyncState(0, ["counter"]);

  const handleIncrement = (): void => {
    console.log("Incrementing count. Current count:", count);
    setCount(count + 1);
  };

  return (
    <div className="card">
      <button onClick={handleIncrement}>count is {count}</button>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </div>
  );
}
