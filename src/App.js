import React from "react";
import Tree from "./components/Tree";
import ButtonOption from "./components/ButtonOption";
import Search from "./components/Search";
import TimeDown from "./components/TimeDown";
import "./styles.css";

const App = ({ topLevel, estimatedItemSize, containerHeight, treeData }) => {
  return (
    <div className="App">
      <Search />
      <Tree
        topLevel={topLevel}
        estimatedItemSize={estimatedItemSize}
        containerHeight={containerHeight}
        treeData={treeData}
      />
      <ButtonOption />
      <TimeDown />
    </div>
  );
};

export default App;
