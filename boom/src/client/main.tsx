import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import App from "./App";

const rootElement: HTMLElement | null = document.getElementById("root");
if (rootElement !== null) {
  const root: Root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
