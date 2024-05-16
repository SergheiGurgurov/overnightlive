import App from "./App.svelte";
import "./app.css";
import "./socket";

const app = new App({
  target: document.querySelector("body"),
});

export default app;
