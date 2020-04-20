# 接口文档


## 对外开放的属性和方法
窗口可视高度,
每项预估高度,
数据集合,
是否开启查询,
是否允许新增,
是否允许删除,
查询回调,
删除回调,
新增回调,

## 获取偏移量
虚拟列表: 即按需显示, 只对可视区域渲染.
假设每项高 itemH=50, 可视区域高度是screenH = 500, 即初始起始位置start为0, 初始渲染结束end = Math.ceil(screenH / itemH);
visibleCount = Math.ceil(screenH / itemH);
滚动时, 滚动条距顶部 scrollTop = 150. 此时:
    1. start = Math.floor(scrollTop);
    2. end = start + visibleCount;
顶部缓冲池: aboveCount;
底部缓冲池: belowCount;
最终显示到页面上的实际数据起始索引: start - aboveCount, 终止索引: end + belowCount

## 生成符合需求的树状数据
```
param: {
    // 初始数据: Array<null>
    treeData,
}
fnGenerateFeatureTreeData: () => {}
return: 新数组
```

## 全部展开/收起
```
param: {
    // 当前状态(默认收起: Boolean(false))
    state,
    // 树形数据
    treeData,
}
fnToggleExpandAll: 遍历所有节点, 生成新数组, 每项有 isExpand 和 isParentExpand
return: 新数组
```

## 新增
```
param: {
    // 当前选中的节点
    selectNode,
    // 当前选中节点的父节点
    parentOfSelectNodeParent,
    // 新增的节点
    newNodes,
}
fnAddNodes: () => {
    parentOfSelectNodeParent.children = [...parentOfSelectNodeParent.children, ...nodes];
    fnGenerateFeatureTreeData();
}
return
```

## 删除
```
param: {
    // 当前选中的节点
    selectNode,
    // 当前选中节点的父节点
    parentOfSelectNodeParent,,
    treeData,
}
fnAddNodes: () => {
    // 找到选中节点是父节点的第几个元素, 通过key
    var index = fn(parentOfSelectNodeParent, key);
    parentOfSelectNodeParent.children.splice(index, 1);
    fnGenerateFeatureTreeData(treeData);
}
return
```

## 修改
```
param: {
    // 当前选中的节点
    selectNode,
    // 改变后的值
    changedValue,
    treeData,
}
fnSearchNodes: () => {
    treeData = fn(selectNode, changedValue);
    fnGenerateFeatureTreeData(treeData);
}
return
```
