import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TourIntelligence from "../app/TourIntelligence";
import "../app/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TourIntelligence />
  </StrictMode>,
);
