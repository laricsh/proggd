import React, { useState, useEffect } from "react";

export default function ExampleFlask(props: any) {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React and flask</h1>
        {/* Calling a data from setdata for showing */}
        <p>{props.graph}</p>
      </header>
    </div>
  );
}
