import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import notes from "../notes";

function App() {
  
  const [info, setInfo] = useState({
    key: "",
    title: "",
    content: ""
  }); // stores form input values

  const [backendData, setBackendData] = useState([{}]);
  const [note, setNote] = useState(backendData);
  const [dataUpdated, setDataUpdated] = useState(true);

  useEffect(() => {
      fetch("/api").then(
        response => response.json()
      ).then(
        data => {
          if (data.title !== "" && data.content !== "") {
            setNote([...note, data]);
            setBackendData(data);
          }
        }
      )
    }, [dataUpdated])

  function handleChange(event) {
    const { value, name } = event.target;

    setInfo((prevValue) => {
      if (name === "title") {
        return {
          title: value,
          content: prevValue.content
        };
      } else if (name === "content") {
        return {
          key: note.length + 1,
          title: prevValue.title,
          content: value
        };
      }
    });
  }

  const addNote = () => {
    async function postData () {
      const response = await fetch("/api/postData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          key: info.length + 1,
          title: info.title,
          content: info.content
        })
      })
      if (response?.status === 200) {
        setDataUpdated(!dataUpdated);
        setInfo({ key: "", title: "", content: ""});
      }
    };
    if (info.title.trim() !== "" && info.content.trim() !== "") {
      postData();
    }
  };

  const deleteNote = (id) => {
    async function deleteData (id) {
      const response = await fetch("/api/deleteData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          userId: id
        }),
      })
      if (response?.status === 200) {
        setDataUpdated(!dataUpdated);
      }
    };
    deleteData(id);
  }

  return (
    <div>
      <Header />
      <div className="mainnote">
        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
          value={info.title}
        />
        <input
          name="content"
          placeholder="Take a note..."
          onChange={handleChange}
          type="text"
          value={info.content}
        />
        <button className=".update" onClick={addNote}>
          <span>ADD</span>
        </button>
      </div>
      {(backendData.length === 0) ? (
        <p></p>
      ):(
        backendData.map((notes, i) => (
          <Note
            className="note"
            key={i}
            title={notes.title}
            content={notes.content}
            onDelete={() => deleteNote(notes._id)}
          />
        ))
      )}
      <Footer />
    </div>
  );
}

export default App;
