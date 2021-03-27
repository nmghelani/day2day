import React from "react";
import "./App.css";

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
    hour -= 12;
  } else {
    a = "AM";
  }
  return hour + ":" + min + " " + a;
}

function App() {
  const data = [
    {
      start: new Date(2021, 2, 27, 14, 53, 0, 0),
      end: new Date(2021, 2, 27, 14, 54, 0, 0),
      task: "Dcoder",
    },
    {
      start: new Date(2021, 2, 27, 14, 55, 0, 0),
      end: new Date(2021, 2, 27, 14, 56, 0, 0),
      task: "Android",
    },
  ];
  var start_time = data[0]["start"];
  var end_time = data[data.length - 1]["end"];
  const [title, setTitle] = React.useState("Free-time");
  const [progress, setProgress] = React.useState(0);
  const [time, setTime] = React.useState(new Date());
  setInterval(() => {
    var date = new Date();
    setTime(date);

    var found = false;
    data.map((task) => {
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
  }, 1000);
  return (
    <div className="App">
      <div className="content">
        <h1>{time.toLocaleString()}</h1>
        <h1>{title}</h1>
        <div className="timeline">
          {data.map((task, index) => {
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
          {data.map((task, index) => {
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
      </div>
    </div>
  );
}

export default App;
