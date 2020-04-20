import React, { useCallback, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { Checkbox, Input } from "antd";
import { RightOutlined, DownOutlined, EditOutlined } from "@ant-design/icons";
import shortid from "shortid";
import {
  // List,
  Map,
} from 'immutable';
import {
  updateTreeNodeTitle,
  switchNodeExpand,
} from '../../modal/treeModal';
import { debounce } from '../../util';
import "./tree-node.css";

import {
  UPDATE_TREE_NODE,
  UPDATE_DEFAULT_STATE,
} from "../../constant/TreeActionType";

const PlaceHolder = () => <span>&nbsp;&nbsp;</span>;

window.keyToLabelMap = Map({});

const TreeNode = ({ data = {}, changeTitle}) => {
  const state = useSelector(state => state);
  const refTitle = useRef(null);
  const refNodeWrap = useRef(null);
  const selectNode = state.get('selectNode');
  const search = state.get('search');
  const isExpandAll = state.get('isExpandAll');
  const {
    isLeaf,
    label,
    // value,
    splitNum,
    isExpand,
    isParentExpand,
    _index,
    key,
  } = data;

  const dispatch = useDispatch();
  // 显示文字编辑框
  const [visible, setVisible] = useState(false);

  const toggleSelectNodeState = () => {
    dispatch({
      type: UPDATE_DEFAULT_STATE,
      payload: {
        key: 'selectNode',
        value: selectNode === key ? null : key,
      }
    });
  }

  const handleToggleExpand = useCallback((isExpand) => {
    // const treeData = state.get('treeData').toArray();
    const treeData = state.get('treeData');
    const tempTreeData = switchNodeExpand(key, isExpand, treeData);
    dispatch({
      type: UPDATE_TREE_NODE,
      // payload: List(treeData)
      payload: tempTreeData
    });
  }, [dispatch, state.get('treeData')]);

  const handleChangeTitle = useCallback(
    debounce(() => {
      if (!refTitle || !refTitle.current) return;
      if (!refNodeWrap || !refNodeWrap.current) return;
      changeTitle(+(refNodeWrap.current.id.slice(1)), refTitle.current.value);
      window.keyToLabelMap = window.keyToLabelMap.set(key, refTitle.current.value);
      console.log(window.keyToLabelMap);
    }, 500),
    [dispatch, state.get('treeData'), refTitle, refNodeWrap]
  );

  const tempArrSpace = [];
  for (let i = 0; i < splitNum; i++) {
    tempArrSpace.push(<PlaceHolder key={shortid.generate()} />);
  }
  // 操作图标
  const tempIcon = isExpandAll || isExpand ? <RightOutlined /> : <DownOutlined />;
  // 隐藏DOM
  const isHidden = isExpand && isParentExpand;

  if (isHidden) return null;

  if (!!search) {
    return (
      <div className="kd-tree-node-wrap" id={_index} ref={refNodeWrap}>
        {/* 预留checkbox */}
        {/* <Checkbox /> */}
        <span className="kd-tree-node-title">
          {
            visible ? (
              <input
                ref={refTitle}
                autoFocus
                defaultValue={label}
                onBlur={() => setVisible(!visible)}
                onChange={handleChangeTitle}
              />
            ) : (
              <span className="title-edit-wrap">
                <span
                  title="选中"
                  onClick={toggleSelectNodeState}
                  style={{ backgroundColor: selectNode === key ? 'rgba(100, 100, 100, 0.8)' : 'transparent' }}
                >
                  {label}
                </span>
                <EditOutlined className="edit-tree-node-title" title="编辑" onClick={() => setVisible(!visible)} />
              </span>
            )
          }
        </span>
      </div>
    );
  }

  return (
    <div className="kd-tree-node-wrap" id={_index} ref={refNodeWrap}>
      {/* 预留checkbox */}
      {/* <Checkbox /> */}
      <span className="kd-tree-node-title">
        {tempArrSpace}
        {isLeaf ? (
          <span className="kd-tree-node-title-txt" />
        ) : (
          <span
            onClick={e => {
              e.preventDefault();
              handleToggleExpand(!isExpand, key);
            }}
            title="展开/收起"
          >{tempIcon}</span>
        )}
        {visible ? (
          <input
            ref={refTitle}
            autoFocus
            defaultValue={label}
            onBlur={() => setVisible(!visible)}
            onChange={handleChangeTitle}
          />
        ) : (
          <span className="title-edit-wrap">
            <span
              onClick={toggleSelectNodeState}
              title="选中"
              style={{ backgroundColor: selectNode === key ? 'rgba(100, 100, 100, 0.8)' : 'transparent' }}
            >
              {label}
            </span>
            <EditOutlined className="edit-tree-node-title" title="编辑" onClick={() => setVisible(!visible)} />
          </span>
        )}
      </span>
    </div>
  );
};

export default TreeNode;
