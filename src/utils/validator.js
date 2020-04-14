/* eslint-disable import/prefer-default-export */

/**
 * 校验的正则表达式
 */
const validRegExp = {
    // 手机号规则：不对号段做校验，由后台判断该手机号是否存在，web只判断数字长度
    phoneNumber: /^[0-9]{11}$/,
    // 密码规则：8-16位，必须同时包含数字与字母
    password: /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{8,16}$/
};

/**
 * 校验的提示语
 */
const validTip = {
    notEmpty: '{0}不能为空',
    inputCorrect: '请输入正确{0}',
    pleaseInput: '请输入{0}',
    pleaseInputAgain: '请再次输入{0}',
    passwordNotSame: '两次新密码不一致',
    passwordRule: '请输入{0}-{1}位数字与字母组合的有效密码'
};

/**
 * 提示语占位符替换方法
 *
 * @param {String} oriStr    含占位符{}的待替换字符串
 * @param {Array<String>} strArr    依次序012345..替换进占位符的字符串数组
 */
const getValidMessage = (oriStr, strArr) => {
    if (!strArr.length) {
        return oriStr;
    }

    strArr.forEach((n, i) => {
        oriStr = oriStr.replace(new RegExp(`\\{${i}\\}`, 'g'), n);
    });

    return oriStr;
};

export { validRegExp, validTip, getValidMessage };
