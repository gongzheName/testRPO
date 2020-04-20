import React, { Profiler } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";

import App from "./App";

const rootElement = document.getElementById("__kd_content__");
const profilerRender = function(id, phase, actualDuration) {
  console.log("本次渲染花费时间(ms):", id, phase, actualDuration);
};

ReactDOM.render(
  <React.StrictMode>
    <Profiler id="Navigation" onRender={profilerRender}>
      <Provider store={store}>
        <App />
      </Provider>
    </Profiler>
  </React.StrictMode>,
  rootElement
);
