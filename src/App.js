import React from "react";
import { v4 as uuidv4 } from "uuid";
import { randomColor } from "randomcolor";
import Draggable from "react-draggable";
import { FaClipboardList } from "react-icons/fa";
import { TbTools } from "react-icons/tb";
import { MdTaskAlt } from "react-icons/md";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [time, setTime] = useState(getTime());

  // обновление времени каждую секунду
  useEffect(() => {
    setInterval(() => {
      setTime(getTime());
    }, 1000);
  });

  const [item, setItem] = useState("");

  // получение данных из localStorage
  const [localItem, setLocalItem] = useState(
    JSON.parse(localStorage.getItem("elems")) || []
  );

  //после обновления элементов в item, запускается запись данных в localStorage
  useEffect(() => {
    localStorage.setItem("elems", JSON.stringify(localItem));
  }, [localItem]);

  // добавление таска. присваивание ему цвета,id, позиции, вывод таска на страницу  ===========
  const newItem = () => {
    if (item.trim() !== "") {
      const newElem = {
        id: uuidv4(),
        task: item,
        color: randomColor({
          luminosity: "light",
        }),
        defaultPos: {
          x: 0,
          y: 0,
        },
      };
      setLocalItem((localItem) => [...localItem, newElem]);
      setItem("");
    } else {
      <h1>Добавьте задачу...</h1>;
      setItem("");
    }
  };

  // удаление задачи ===========
  const deleteNode = (id) => {
    setLocalItem(localItem.filter((el) => el.id !== id));
  };

  // обновление позиции после перетаскивания ===========
  const updatePos = (data, index) => {
    let newArray = [...localItem];
    newArray[index].defaultPos = { x: data.x, y: data.y };
    setLocalItem(newArray);
  };

  // добавление через кнопку Enter ===========
  const keyPress = (el) => {
    const code = el.keyCode || el.which;
    if (code === 13) {
      newItem();
    }
  };

  // часы ===========
  function getTime() {
    let time = new Date().toLocaleTimeString();
    return time;
  }

  return (
    <div className="App">
      <div className="wrapper">
        <div className="container">
          <div className="container__radio"></div>
          <div className="container__time">
            <h3>{time}</h3>
          </div>
          <div className="todo__form">
            <input
              value={item}
              type="text"
              placeholder="Добавить задачу..."
              onChange={(e) => setItem(e.target.value)}
              onKeyDown={(e) => keyPress(e)}
            />
            <button className="enter" type="button" onClick={newItem}>
              Добавить
            </button>
          </div>
          <div className="todo__steps">
            <div className="steps__title">
              <div className="title__steps">
                <h2>Новые задачи</h2>{" "}
                <FaClipboardList className="react__icons" />
              </div>
              <div className="title__steps">
                <h2>В процессе</h2> <TbTools className="react__icons" />
              </div>
              <div className="title__steps">
                <h2>Завершенные</h2> <MdTaskAlt className="react__icons" />
              </div>
            </div>
            <div className="steps__block">
              <div className="steps__new">
                <ul className="todo__item">
                  {localItem.map((el, index) => {
                    return (
                      <Draggable
                        bounds=".steps__block"
                        position={el.defaultPos}
                        key={index}
                        onStop={(_, data) => {
                          updatePos(data, index);
                        }}
                      >
                        <li style={{ backgroundColor: el.color }}>
                          {`${el.task}`}
                          <button
                            className="delete"
                            onClick={() => deleteNode(el.id)}
                          >
                            X
                          </button>
                        </li>
                      </Draggable>
                    );
                  })}
                </ul>
              </div>
              <div className="steps__started"></div>
              <div className="steps__completed"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
