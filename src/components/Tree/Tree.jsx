import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import {
  Seq,
  List,
} from 'immutable';
import TreeNode from "../TreeNode";
import {
  estimatedItemSize,
  topLevel,
} from '../../constant/treeData';
import {
  getComputedVisibleCount,
  computePhantomHeight,
  setContentOffset,
  flattenArray,
  getSearchList,
  getVisibleData,
  getTopLevelData,
  getNormalData,
} from '../../modal/treeModal';
import { debounce } from "../../util";
import "./tree.css";

const Tree = () => {
  const state = useSelector(state => state);
  const search = state.get('search');

  const refList = useRef(null);
  const refPhantom = useRef(null);
  const refContent = useRef(null);
  const refItems = useRef(null); // 没用上

  // 视窗高度
  const [screenHeight, setScreenHeight] = useState(0);
  // 起始索引
  const [start, setStart] = useState(0);
  // 起始索引
  const [flattenTree, setFlattenTree] = useState([]);
  // 可视区域内, 元素总数: 计算可视区域总条目数
  const visibleCount = getComputedVisibleCount(screenHeight, estimatedItemSize);

  // 获取查询数据
  const searchData = useMemo(() => {
    if (!search) return [];
    return  getSearchList(search, flattenTree, topLevel);
  }, [search, flattenTree]);
  // 渲染到页面上的数据列表
  const visibleData = useMemo(() => {
    if (search) {
      return getTopLevelData(topLevel, searchData);
    }
    return getNormalData(start, visibleCount, flattenTree);
  }, [flattenTree, search, start, visibleCount, searchData]);

  useEffect(() => {
    const nodeArr = [];
    flattenArray(state.get('treeData').toArray(), false, nodeArr);
    setFlattenTree(nodeArr);
  }, [state.get('treeData')]);
  useEffect(() => {
    computePhantomHeight(refPhantom, flattenTree.length || 0, { estimatedItemSize, search });
  }, [refPhantom, flattenTree, search]);
  useEffect(() => {
    if (!refList) return;
    setScreenHeight(refList.current.clientHeight);
  }, [refList]);

  const changeTitle = useCallback((index, value) => {
    flattenTree[index].label = value;
    setFlattenTree(flattenTree);
  }, [flattenTree]);

  const handleScroll = useCallback(() => {
    if (!refList || !refList.current) return;
    const scrollTop = refList.current.scrollTop;
    setStart(Math.floor(scrollTop / estimatedItemSize));
    setContentOffset(refContent, scrollTop, estimatedItemSize);
  }, [refList, refContent]);

  if (window.addEventListener) {
    window.addEventListener('keydown', debounce(function(event) {
      if ([38, 40].includes(event.keyCode)) {
        handleScroll();
      }
    }, 500), false);
  }

  return (
    <div className="kd-tree-wrap">
      <div ref={refList} className="infinite-list-container" onScroll={handleScroll}>
        <div ref={refPhantom} className="infinite-list-phantom"></div>
        <div ref={refContent} className="infinite-list">
          {
            visibleData.size ?
              visibleData.toArray().map((item, index) => (
                <TreeNode key={item.value} data={item} index={index} changeTitle={changeTitle} />
              ))
              : <span>查无记录, 请修改查询条件</span>
          }
        </div>
      </div>
      <div style={{ textAlign: "left" }}>记录总数: <b>{flattenTree.length}</b></div>
      <div style={{ textAlign: "left" }}>查询结果总数: <b>{searchData.length}</b></div>
      {
        search && <div style={{ textAlign: "left" }}>显示前 <b>{topLevel}</b> 条记录</div>
      }
      <br />
    </div>
  );
};

export default Tree;
