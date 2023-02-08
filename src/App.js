import React from "react";
import { v4 as uuidv4 } from "uuid";
import { randomColor } from "randomcolor";
import Draggable from "react-draggable";

import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [item, setItem] = useState("");

  const [localItem, setLocalItem] = useState(
    JSON.parse(localStorage.getItem("elems")) || []
  );

  useEffect(() => {
    localStorage.setItem("elems", JSON.stringify(localItem));
  }, [localItem]);

  const newItem = () => {
    if (item.trim() !== "") {
      const newElem = {
        id: uuidv4(),
        task: item,
        color: randomColor({
          luminosity: "light",
        }),
        defaultPos: {
          x: 100,
          y: 100,
        },
      };
      setLocalItem((localItem) => [...localItem, newElem]);
      setItem("");
    } else {
      <h1>Добавьте задачу...</h1>;
      setItem("");
    }
  };

  const deleteNode = (id) => {
    setLocalItem(localItem.filter((el) => el.id !== id));
  };

  const updatePos = (data, index) => {
    let newArray = [...localItem];
    newArray[index].defaultPos = { x: data.x, y: data.y };
    setLocalItem(newArray);
  };

  const keyPress = (el) => {
    const code = el.keyCode || el.which;
    if (code === 13) {
      newItem();
    }
  };

  return (
    <div className="App">
      <div className="wrapper">
        <input
          value={item}
          type="text"
          placeholder="Добавить задачу..."
          onChange={(e) => setItem(e.target.value)}
          onKeyPress={(e) => keyPress(e)}
        />
        <button className="enter" type="button" onClick={newItem}>
          Добавить
        </button>
        <ul className="todo__item">
          {localItem.map((el, index) => {
            return (
              <Draggable
                defaultPosition={el.defaultPos}
                key={index}
                onStop={(_, data) => {
                  updatePos(data, index);
                }}
              >
                <li style={{ backgroundColor: el.color }}>
                  {`${el.task}`}{" "}
                  <button className="delete" onClick={() => deleteNode(el.id)}>
                    X
                  </button>
                </li>
              </Draggable>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
