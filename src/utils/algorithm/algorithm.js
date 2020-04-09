class BSTNode {
    constructor(key){
        this.key = key || Symbol();
        this.lChild = null;
        this.rChild = null;
    }
}

/**
 * 根据前序遍历字符串生成二叉排序树
 * 空数据的地方用#表示
 * @param {BSTNode}} node 
 */
function createPreOrderBST(node, strArr) {
    if (strArr.length == 0) return;
    let str = strArr.shift();
    if (str == '#') return;
    node.key = str;
    // 左子树
    if (strArr[0] != '#') {
        node.lChild = new BSTNode();
        createPreOrderBST(node.lChild, strArr);
    } else {
        strArr.shift();
    }
    // 右子树
    if (strArr[0] != '#') {
        node.rChild = new BSTNode();
        createPreOrderBST(node.rChild, strArr);
    } else {
        strArr.shift();
    }
}

function getPreOrderBST(str) {
    // 前序遍历得到的字符串
    let strArr = str.split('');
    const rootNode = new BSTNode();
    createPreOrderBST(rootNode, strArr);

    return rootNode;
}

export {
    getPreOrderBST
}