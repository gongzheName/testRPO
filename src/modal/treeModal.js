// import { List, fromJS, Map } from "immutable";
import faker from "faker";
import { Seq, List } from 'immutable';
import { topLevel } from '../constant/treeData';

/**
   * 定义数据结构
   * @param {string} key 节点 key 值
   * @param {string} label 节点显示的字符串
   * @param {boolean} isExpand 是否展开, 默认false
   * @param {array<defineDataStructure>} children 子节点数据
   */
const defineDataStructure = [{
  key: '0-',
  label: '',
  value: '', 
  isExpand: false,
  children: [],
}];

/**
   * 获取H5 data属性值
   * @param {node} node 属性绑定的节点
   * @param {string} dataName data属性名
   * @return {any} 返回属性值
   */
function getH5Data(node, dataName) {
    return node.dataset[dataName];
}

/**
   * 将节点key用 splitStr 切割成数组; 节点key以 '0-'开头, 所以要从第三个字符开始截取
   * @param {string} selectKey 节点 key 值
   * @param {string} splitStr 分割符
   * @return {array} 切割后的数组
   */
function getArrayLevel(selectKey, splitStr) {
    return selectKey.slice(2).split(splitStr).map(i => (i -= 0));
}

/**
   * 将节点key用 splitStr 切割成数组; 节点key以 '0-'开头, 所以要从第三个字符开始截取
   * @param {string} selectKey 节点 key 值
   * @param {string} splitStr 分割符
   * @return {array} 切割后的数组
   */
function getArrayLevelWithChildren(selectKey, splitStr) {
    const arrKeyLevel = selectKey.slice(2).split(splitStr).map(i => (i -= 0));
    const length = arrKeyLevel.length;
    const tempArr = [];
    for (let i = 0; i < length; i++) {
      tempArr.push(arrKeyLevel[i]);
      if (i < length - 1) {
        tempArr.push('children');
      }
    }
    return tempArr;
}

/**
   * 遍历Map结构中的所有数据, 修改treeData, 并返回新的treeData数据
   * @param {array} treeData 原始数据
   * @return {array} 修改后的数据
   */
function traverseMapStructureAndChangeTreeData(treeData) {
    if (window.keyToLabelMap.size <= 0) return treeData.toArray();
    let changedTreeData = treeData;
    window.keyToLabelMap.map((label, key) => {
      const arrKeyLevel = getArrayLevelWithChildren(key, '-');
      changedTreeData = changedTreeData.setIn([...arrKeyLevel, 'label'], label);
    });
    window.keyToLabelMap = window.keyToLabelMap.clear();
    console.log(window.keyToLabelMap);
    // console.log('===============');
    return changedTreeData.toArray();
}

/**
   * 二分法查找
   * @param {array} list 被查找数组
   * @param {string} value 查询值
   * @return {number} 查找成功返回下标; 失败返回-1
   */
const binarySearch = (list,value) => {
  let start = 0;
  let end = list.length - 1;
  let tempIndex = null;

  while(start <= end){
    let midIndex = parseInt((start + end)/2, 10);
    let midValue = list[midIndex].bottom;
    if(midValue === value){
      return midIndex + 1;
    }else if(midValue < value){
      start = midIndex + 1;
    }else if(midValue > value){
      if(tempIndex === null || tempIndex > midIndex){
        tempIndex = midIndex;
      }
      end = end - 1;
    }
  }
  return tempIndex;
}

/**
   * 获取新增后的新数组
   * @param {string} selectKey 选中节点对应的key值
   * @param {nodeList} existedChildrenNodes 选中节点的子节点数组
   * @param {number} addCount 在当前节点下新增子节点的个数
   * @return {array} 返回一个新增后的新数组
   */
const getAddItems = (selectKey, existedChildrenNodes, addCount) => {
    const length = existedChildrenNodes.length;
    for (let i = 0; i < addCount; i++) {
      const key = `${selectKey}-${length + i}`;
      existedChildrenNodes.push({
        label: faker.lorem.words(),
        value: `${key}-value`,
        key,
      });
    }
    return existedChildrenNodes;
}

/**
   * 新增树节点
   * @param {node} selectNode 选中节点
   * @param {string} selectKey 选中节点对应的key值
   * @param {number} addCount 在当前节点下新增子节点的个数
   * @param {array} treeData 树状数据
   * @return {array} 返回一个新增后的新数组
   */
async function addTreeNodes(selectNode, selectKey, treeData, dataName) {
    // 获取选中节点的子节点数组
    if (!selectKey) return alert('请先选中节点');
    const changedTreeData = traverseMapStructureAndChangeTreeData(List(treeData));
    // const changedTreeData = treeData;
    const addCount = getH5Data(selectNode, dataName);
    const arrKeyLevel = getArrayLevel(selectKey, '-');
    const arrKeyLevelLength = arrKeyLevel.length;
    let tempTreeNodeData = changedTreeData;
    for (let i = 0; i < arrKeyLevelLength; i++) {
        if (i === arrKeyLevelLength - 1) {
            // 当前节点在同级兄弟节点的下标
            const currentIndex = arrKeyLevel[i];
            // 获取当前节点的子节点
            const childrenNodes = tempTreeNodeData[currentIndex].children || [];
            const childrenNodes1 = getAddItems(selectKey, childrenNodes, addCount);
            tempTreeNodeData[currentIndex].children = childrenNodes1;
            break;
        }
        tempTreeNodeData = tempTreeNodeData[arrKeyLevel[i]].children;
    }
    return changedTreeData;
}
  
/**
   * 改变受影响范围最小节点的 key 值
   * @param {string} selectKey 选中节点对应的key值
   * @param {array} currentSiblingNodes 当前节点的兄弟节点
   * @return {array} 返回一个改变后的新数组
   */
const getEffectedNodesByDelete = (selectKey, currentSiblingNodes) => {
    const currentIndex = +selectKey.slice(-1);
    const currentKeyLength = selectKey.length;
    const siblingLength = currentSiblingNodes.length;
    if (currentIndex >= siblingLength - 1) return;
    for (let i = currentIndex; i < siblingLength; i++) {
      const siblingItem = currentSiblingNodes[i];
      const tempArrOfKey = siblingItem.key.split('-');
      const tempChangedIndex = (currentKeyLength - 1) / 2;
      tempArrOfKey[tempChangedIndex] = `${(+tempArrOfKey[tempChangedIndex]) - 1}`;
      const key = tempArrOfKey.join('-');
      const children = currentSiblingNodes[i].children;
      currentSiblingNodes[i].key = key;
      currentSiblingNodes[i].value = `${key}-value`;
      if (children && children.length > 0) {
        getEffectedNodesByDelete(selectKey, children);
      }
    }
    return currentSiblingNodes;
  }
  
/**
   * 删除树节点
   * @param {string} selectKey 选中节点对应的key值
   * @param {array} treeData 树状数据
   * @return {array} 返回一个变化后的新数组
   */
async function deleteTreeNode(selectKey, treeData) {
    // 获取选中节点的子节点数组
    if (!selectKey) return alert('请先选中节点');
    const changedTreeData = traverseMapStructureAndChangeTreeData(List(treeData));
    // const changedTreeData = treeData;
    const arrKeyLevel = getArrayLevel(selectKey, '-');
    const arrKeyLevelLength = arrKeyLevel.length;
    let tempTreeNodeData = changedTreeData;
    for (let i = 0; i < arrKeyLevelLength; i++) {
        if (i === arrKeyLevelLength - 1) {
            // 删除选中节点, 已改变原数组
            tempTreeNodeData.splice(arrKeyLevel[i], 1);
            getEffectedNodesByDelete(selectKey, tempTreeNodeData);
            break;
        }
        // debugger;
        tempTreeNodeData = tempTreeNodeData[arrKeyLevel[i]].children;
    }
    console.log(2);
    return changedTreeData;
}

/**
   * 修改树节点
   * @param {string} selectKey 选中节点对应的key值
   * @param {array} treeData 树状数据
   * @param {string} value 修改后的title
   * @return {array} 返回一个变化后的新数组
   */
function updateTreeNodeTitle(selectKey, value, treeData) {
    const arrKeyLevel = getArrayLevelWithChildren(selectKey, '-');
    // const arrKeyLevelLength = arrKeyLevel.length;
    // let tempObj = treeData;
    // for (let i = 0; i < arrKeyLevelLength; i++) {
    //   if (i === arrKeyLevelLength - 1) {
    //     tempObj = tempObj[arrKeyLevel[i]];
    //     break;
    //   }
    //   tempObj = tempObj[arrKeyLevel[i]].children;
    // }
    return treeData.setIn([...arrKeyLevel, 'label'], value);
}

/**
   * 切换节点展开/收起
   * @param {string} selectKey 选中节点对应的key值
   * @param {array} treeData 树状数据
   * @param {string} isExpand 是否展开
   * @return {array} 返回一个变化后的新数组
   */
function switchNodeExpand(selectKey, isExpand, treeData) {
    // const arrKeyLevel = getArrayLevel(selectKey, '-');
    // const arrKeyLevelLength = arrKeyLevel.length;
    // let tempObj = treeData;
    // for (let i = 0; i < arrKeyLevelLength; i++) {
    //   if (i === arrKeyLevelLength - 1) {
    //     tempObj = tempObj[arrKeyLevel[i]];
    //     break;
    //   }
    //   tempObj = tempObj[arrKeyLevel[i]].children;
    // }
    // tempObj.isExpand = isExpand;
    const arrKeyLevel = getArrayLevelWithChildren(selectKey, '-');
    return treeData.setIn([...arrKeyLevel, 'isExpand'], isExpand);
}

/**
   * 计算可视区域总条目数
   * @param {number} screenHeight 可视区域高度
   * @param {number} estimatedItemSize 每条数据高度
   * @return {array} 返回可视区域总条目数
   */
function getComputedVisibleCount(screenHeight, estimatedItemSize) {
    return Math.ceil(screenHeight / estimatedItemSize);
}

/**
   * 计算撑开物的高度
   * @param {node} refPhantom 撑开物的节点
   * @param {number} listDataLength 拍平的数组长度
   * @param {number} estimatedItemSize 每条数据高度
   * @param {string} search 查询内容
   * @return {void}
   */
function computePhantomHeight(refPhantom, listDataLength, options = {estimatedItemSize, search}) {
    const {
      estimatedItemSize,
      search,
    } = options;
    if (!refPhantom) return;
    if (!!search) {
      refPhantom.current.style.height = '0px';
    } else {
      const height = listDataLength * estimatedItemSize;
      refPhantom.current.style.height = height + 'px';
    }
}

/**
   * 设置list偏移量
   * @param {node} refContent 树列表的dom
   * @param {number} scrollTop 拍平的数组长度
   * @param {number} estimatedItemSize 每条数据高度
   * @return {void}
   */
function setContentOffset(refContent, scrollTop, estimatedItemSize) {
  const tempStartOffset = scrollTop - (scrollTop % estimatedItemSize);
  refContent.current.style.transform = `translate3d(0,${tempStartOffset}px,0)`;
}

/**
   * 多维数组拍平成一维数组
   * @param {array} treeData 多维数组
   * @param {boolean} isParentExpand 父级是否展开
   * @param {array} nodeArr 拍平后的一维数组
   * @param {number} idNumber dom节点的id
   * @return {void}
   */
let idNumber = 0;
function flattenArray(treeData, isParentExpand, nodeArr, i = 0) {
  // treeData = List(treeData).setIn([...arrKeyLevel1, 'label'], window.keyToLabelMap.get(key));
  // console.log(window.keyToLabelMap.get('key'));
  // window.keyToLabelMap.delete('key');
  // console.log(window.keyToLabelMap.toJS());
  treeData.forEach(item => {
    const { key, value, label, children } = item;
    let isExpand = item.isExpand || false;
    const temp0 = key.slice(2).match(/-/gi);
    const splitNum = (temp0 || []).length;
    const isLeaf = !(children &&
                   children instanceof Array &&
                   children.length > 0);
    
    const tempItem = {
      key,
      value,
      // label: window.keyToLabelMap.has(key) ? window.keyToLabelMap.get(key) : label,
      label,
      splitNum,
      isLeaf,
      isExpand: isParentExpand || isExpand,
      isParentExpand,
      _index: `_${i}`,
    };
    nodeArr.push(tempItem);
    i++;
    // if (window.keyToLabelMap.has(key)) {
    //   window.keyToLabelMap = window.keyToLabelMap.delete(key);
    // }
    if (!isLeaf && !isExpand) {
      flattenArray(children, isExpand || isParentExpand || false, nodeArr, i);
    }
  });
}

/**
   * title查询
   * @param {string} search 搜索字符串
   * @param {array} flattenData 所有数据拍平后的一维数组
   * @return {array}
   * 备选方案: 直接查出前n条数据跳出
   */
function getSearchList(search, flattenData) {
  return flattenData.filter((item) => {
    if (item.label.includes(search)) {
      return true;
    }
  });
}

/**
   * 获取当前视窗的数据
   * @param {array} searchData 查询结果
   * @param {array} flattenData 所有数据拍平后的一维数组
   * @param {object} options 可选项/配置项
   * @return {array}
   */
function getVisibleData(options = {searchData: [], flattenData: [], search: '', start: 0, topLevel: 10, visibleCount: 10}) {
    const {
      searchData,
      flattenData,
      search,
      start,
      topLevel,
      visibleCount,
    } = options;
    let seqListData = Seq(searchData);
    if (!flattenData) return;
    if (!!search) {
      return seqListData.slice(0, topLevel).toArray();
    }
    seqListData = Seq(flattenData);
    return seqListData.slice(start, start + visibleCount).toArray();
}

export {
    addTreeNodes,
    deleteTreeNode,
    updateTreeNodeTitle,
    switchNodeExpand,
    getComputedVisibleCount,
    computePhantomHeight,
    setContentOffset,
    flattenArray,
    getSearchList,
    getVisibleData,
};
