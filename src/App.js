import React, { useState, useEffect, useRef } from "react";
import Popup from "./Components/Popup";
import "./App.css";
import TimePicker from "react-time-picker";
import { Button, InputGroup, FormControl, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function getTimeInNumber(date) {
  var hours = date.getHours();
  var p = hours + date.getMinutes() / 60 + date.getSeconds() / 3600;
  return p;
}

function getPerc(curr_time, start_time, end_time) {
  var currdiff = getTimeInNumber(curr_time) - getTimeInNumber(start_time);
  if (currdiff < 0) {
    currdiff += 24;
  }
  var diff = getTimeInNumber(end_time) - getTimeInNumber(start_time);
  if (diff < 0) {
    diff += 24;
  }
  var perc = (currdiff * 100) / diff;
  if (perc > 100) {
    perc = 100;
  }
  perc -= 1;
  if (perc < 0) {
    perc = 0;
  }
  return perc;
}

function getTimeString(date) {
  var hour = date.getHours();
  var min = date.getMinutes();
  if (min < 10) {
    min = "0" + min;
  } else {
    min = String(min);
  }
  var a;
  if (hour >= 12) {
    a = "PM";
    if (hour != 12) hour -= 12;
  } else {
    a = "AM";
    if (hour == 0) hour = 12;
  }
  return hour + ":" + min + " " + a;
}

function getTimeMap(stringTime) {
  var splitByColon = stringTime.split(":");
  var splitBySpace = splitByColon[1].split(" ");
  var hour = Number(splitByColon[0]);
  if (splitBySpace[1] == "PM") {
    if (hour != 12) {
      hour += 12;
    }
  } else {
    if (hour == 12) {
      hour = 0;
    }
  }
  return {
    hour: hour,
    min: Number(splitBySpace[0]),
  };
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [start_time, setStartTime] = useState(new Date());
  const [end_time, setEndTime] = useState(new Date());
  const [title, setTitle] = useState("Free-time");
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(new Date());
  const [showPopup, setShowPopup] = useState(true);
  const [fromDay, setFromDay] = useState("Today");
  const [toDay, setToDay] = useState("Today");

  const [task, setTask] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  useInterval(() => {
    var date = new Date();
    setTime(date);

    var found = false;
    tasks.map((task) => {
      if (
        date.getTime() >= task["start"].getTime() &&
        date.getTime() <= task["end"].getTime()
      ) {
        found = true;
        setTitle(task["task"]);
        return;
      }
    });
    if (!found) {
      setTitle("Free-time");
    }
    setProgress(getPerc(date, start_time, end_time));
  });
  return (
    <div className="App">
      <div className="content">
        <h1>{time.toLocaleString()}</h1>
        <h1>{title}</h1>
        <div className="timeline">
          {tasks.map((task, index) => {
            return (
              <div>
                <div
                  className="break-point"
                  style={{
                    marginLeft:
                      getPerc(task["start"], start_time, end_time) + "%",
                  }}
                ></div>
                <div
                  className="break-point"
                  style={{
                    marginLeft:
                      getPerc(task["end"], start_time, end_time) + "%",
                  }}
                ></div>
              </div>
            );
          })}
          <div className="pointer" style={{ marginLeft: progress + "%" }}></div>
        </div>
        <div className="time-container">
          {tasks.map((task, index) => {
            return (
              <div>
                <div
                  className="time"
                  style={{
                    marginLeft:
                      getPerc(task["start"], start_time, end_time) - 3 + "%",
                  }}
                >
                  {getTimeString(task["start"])}
                </div>
                <div
                  className="time"
                  style={{
                    marginLeft:
                      getPerc(task["end"], start_time, end_time) - 3 + "%",
                  }}
                >
                  {getTimeString(task["end"])}
                </div>
              </div>
            );
          })}
        </div>

        <Button
          className="add-new-btn"
          onClick={() => {
            setShowPopup(true);
          }}
        >
          Add
        </Button>
      </div>

      <div className="list-container">
        <ul className="list">
          {tasks.map((task) => {
            return (
              <li>
                {getTimeString(task.start) +
                  " - " +
                  getTimeString(task.end) +
                  " " +
                  task.task}
              </li>
            );
          })}
        </ul>
      </div>

      <Popup trigger={showPopup}>
        <div>
          <h2>New task</h2>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text className="min-width80" id="basic-addon1">
                Task
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Task to perform"
              aria-label="Task to perform"
              aria-describedby="basic-addon1"
              onChange={(e) => setTask(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text className="min-width80" id="basic-addon1">
                From
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="11:00 AM"
              aria-label="11:00 AM"
              aria-describedby="basic-addon1"
              onChange={(e) => {
                setFromTime(e.target.value);
              }}
            />
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {fromDay}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setFromDay("Today");
                  }}
                >
                  Today
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setFromDay("Tomorrow");
                  }}
                >
                  Tomorrow
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text className="min-width80" id="basic-addon1">
                To
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              onChange={(e) => {
                setToTime(e.target.value);
              }}
              placeholder="11:00 AM"
              aria-label="11:00 AM"
              aria-describedby="basic-addon1"
            />
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {toDay}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setToDay("Today");
                  }}
                >
                  Today
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setToDay("Tomorrow");
                  }}
                >
                  Tomorrow
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </InputGroup>
          <InputGroup className="btn-input-group">
            <Button
              className="add-btn"
              onClick={() => {
                var curr = new Date();
                var start = new Date(curr);
                var end = new Date(curr);

                var time = getTimeMap(fromTime);
                if (fromDay != "Today") {
                  start.setDate(curr.getDate() + 1);
                }
                start.setHours(time["hour"]);
                start.setMinutes(time["min"]);
                start.setSeconds(0);

                time = getTimeMap(toTime);
                if (toDay != "Today") {
                  end.setDate(curr.getDate() + 1);
                }
                end.setHours(time["hour"]);
                end.setMinutes(time["min"]);
                end.setSeconds(0);

                setTasks((data) => [
                  ...data,
                  {
                    start: start,
                    end: end,
                    task: task,
                  },
                ]);
                setStartTime(
                  fromDay == "Today" && start < start_time ? start : start_time
                );
                setEndTime(
                  fromDay == "Today" && end > end_time ? end : end_time
                );
                setShowPopup(false);
              }}
            >
              Add
            </Button>
            <Button
              variant="danger"
              className="close-btn"
              onClick={() => {
                setShowPopup(false);
              }}
            >
              Close
            </Button>
          </InputGroup>
        </div>
      </Popup>
    </div>
  );
}

export default App;
