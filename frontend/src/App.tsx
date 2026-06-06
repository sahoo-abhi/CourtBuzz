import { useState } from "react";

import Landing from "./pages/Landing";
import Homepage from "./pages/Homepage";

function App() {
  const [entered, setEntered] =
    useState(false);

  return entered ? (
    <Homepage />
  ) : (
    <Landing
      onEnter={() =>
        setEntered(true)
      }
    />
  );
}

export default App;