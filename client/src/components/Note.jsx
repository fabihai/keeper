import React from "react";
import info from "./App";
import note from "./App";

function Note(props) {
  return (
    <div class="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={props.onDelete} class=".delete">
        <span>DELETE</span>
      </button>
    </div>
  );
}

export default Note;
