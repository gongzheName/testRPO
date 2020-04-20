// 前端存储数据结构
import { List, fromJS } from "immutable";
import {
  ADD_TREE_ITEM,
  UPDATE_TEMP_VARS,
  UPDATE_TREE_NODE,
  UPDATE_DEFAULT_STATE,
  UPDATE_EXPAND_ALL,
} from "../constant/TreeActionType";
import { gData } from "../constant/treeData";

const defAppState = fromJS({
  search: "",
  treeData: List(gData),
  selectNode: null,
  isExpandAll: false,
});

const reducer = (state = defAppState, action) => {
  switch (action.type) {
    case ADD_TREE_ITEM:
      return state;
    case UPDATE_TEMP_VARS:
      return state.set('search', action.payload);

    case UPDATE_TREE_NODE:
      return state.set('treeData', action.payload);

    case UPDATE_DEFAULT_STATE:
      const { key, value } = action.payload;
      return state.set(key, value);

    case UPDATE_EXPAND_ALL:
      return state.set('isExpandAll', action.payload);
      
    default:
      return state;
  }
};

export default reducer;
