import { useState } from "react";
import "./App.css";
import { Chart } from "../features/chart/Chart";
import React from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
      <Chart />
  );
}

export default App;
