import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { List } from 'immutable';
import { Button } from 'antd';
import {
  addTreeNodes,
  deleteTreeNode,
} from '../../modal/treeModal';
// import "./styles.css";

import {
    UPDATE_TREE_NODE,
    // UPDATE_EXPAND_ALL,
    UPDATE_DEFAULT_STATE,
} from "../../constant/TreeActionType";

const setDataToRedux = (dispatch, treeData) => {
  dispatch({
    type: UPDATE_TREE_NODE,
    payload: List(treeData),
  });
}

const initSelectNode = (dispatch) => {
  dispatch({
    type: UPDATE_DEFAULT_STATE,
    payload: {
      key: 'selectNode',
      value: null,
    }
  });
}

const ButtonOption = () => {
  const state = useSelector(state => state);
  // const isExpandAll = state.get('isExpandAll');
  const treeData = state.get('treeData');
  const selectNode = state.get('selectNode');

  const dispatch = useDispatch();

  const handleDeleteTreeNode = useCallback(async () => {
      if (!selectNode) return alert('请先选中节点');
      const tempTreeData = treeData.toArray();
      const tempTreeNodeData = await deleteTreeNode(selectNode, tempTreeData);
      setDataToRedux(dispatch, tempTreeNodeData);
      initSelectNode(dispatch);
    }, [dispatch, treeData, selectNode]);

  const handleAddItem = useCallback(async function(e) {
      if (!selectNode) return alert('请先选中节点');
      const tempTreeData = treeData.toArray();
      const tempTreeNodeData = await addTreeNodes(e.target.parentNode, selectNode, tempTreeData, 'addCount');
      setDataToRedux(dispatch, tempTreeNodeData);
    }, [dispatch, treeData, selectNode]);

  return (
    <div style={{ marginTop: 70 }}>
        <hr />
        <Button
            data-add-count={10}
            onClick={handleAddItem}
        >新增10条</Button>
        <hr />
        <Button
            data-add-count={100}
            onClick={handleAddItem}
        >新增100条</Button>
        <hr />
        <Button
            data-add-count={1000}
            onClick={handleAddItem}
        >新增1000条</Button>
        <hr />
        <Button
            data-add-count={10000}
            onClick={handleAddItem}
        >新增10000条</Button>
        <hr />
        <Button
            onClick={handleDeleteTreeNode}
        >删除</Button>
        <hr />
    </div>
  );
};

export default ButtonOption;
