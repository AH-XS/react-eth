import React from "react";
import Dog from "./components/Dog";
import Register from "./components/Register";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Digital dog</h1>
      </header>

      <div className="content">
        <Register />
        <Dog />
      </div>
    </div>
  );
}

export default App;
