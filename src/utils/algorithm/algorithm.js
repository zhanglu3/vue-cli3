class BSTNode {
    constructor(data) {
        this.data = data;
        this.lChild = null;
        this.rChild = null;
        this.insert = insertToBST;
    }
}

/**
 * 根据前序遍历字符串生成二叉排序树
 * 空数据的地方用#表示
 * @param {BSTNode}} node 
 */
function createPreOrderBST(node, strArr) {
    if (strArr.length == 0) {
        node = null;
        return;
    }
    let str = strArr.shift();
    if (str == '#') {
        node = null;
        return;
    }
    node.data = str;
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

function insertToBST(val) {
    val = Number(val);
    let parent = this; // 目标结点
    
    if (val === Number(parent.data)) return;

    // 待插入结点
    const node = new BSTNode(val);
    let flag = true;

    while (flag) {
        // 插入左子树
        if (val < Number(parent.data)) {
            // 如果左子树为空，则直接插入
            if (!parent.lChild) {
                parent.lChild = node;
                flag = false;
            } else {
                parent = parent.lChild;
            }
        } else {
            // 如果右子树为空，则直接插入
            if (!parent.rChild) {
                parent.rChild = node;
                flag = false;
            } else {
                parent = parent.rChild;
            }
        }
    }
}

export {
    getPreOrderBST
}