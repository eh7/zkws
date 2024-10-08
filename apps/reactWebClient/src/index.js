import { createRoot } from "react-dom/client";
import { App } from "./App";

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

const container = document.getElementById("app");
const root = createRoot(container)
root.render(<App />);
