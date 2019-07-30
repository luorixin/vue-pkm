import Cookies from 'js-cookie'
import { Message } from 'element-ui'

let Util = {};
Util.title = (title) => {
    title = title || "PKM-FE";
    window.document.title = title;
}

const TokenKey = 'PKM-Token'

Util.getToken = () => {
  return Cookies.get(TokenKey)
}

Util.setToken = (token) => {
  return Cookies.set(TokenKey, token)
}

Util.removeToken = () => {
  return Cookies.remove(TokenKey)
}

/**
 * 存储localStorage
 */
Util.setStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
      content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
Util.getStore = name => {
    if (!name) return;
    return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
Util.removeStore = name => {
    if (!name) return;
    window.localStorage.removeItem(name);
}

/**
 * 统一报错信息
 */
Util.errorProcessor = (vm, error, callback) => {
    let result = error.response ? error.response.data.message : error.message
    Message.error(result)
    callback && callback()
}

/**
 * json排序
 */
Util.sortJson = (order, sortBy, fun) => {
    let ordAlpah = (order == 'asc') ? '>' : '<';
    let sortFun = new Function('a', 'b', 'if (a.' + sortBy + '==null){a.' + sortBy + '=0};if (b.' + sortBy + '==null){b.' + sortBy + '=0};return '+fun+'(a.' + sortBy + ')'+ordAlpah +fun+ '(b.' + sortBy + ')?1:-1');
    return sortFun;
}

/**
 * json数组排序
 */
Util.sortTree = (data, order, sortBy, fun) => {
    data = data.sort(Util.sortJson(order, sortBy, fun));
    data.forEach( (item) => {
        if(item.childrens!=null && item.childrens.length>0){
            Util.sortTree(item.childrens, order, sortBy, fun);
        }
    })
    return data
}

/**
 * 简单数组比较
 */
Util.scalarArrayEquals = (array1,array2) => {
    return array1.length==array2.length && array1.every(function(v,i) { return v === array2[i]});
}

/**
 * 数组查值
 */
Util.findItemFromArray = (array, children, key, value) => {
    let findItem = null
    let newArray = array.slice()
    let _find = (arr) => {
        let _isFind = false
        arr.forEach(item => {
            if(!_isFind){
                if(item[key] && item[key] === value){
                    _isFind = true
                    findItem = Object.assign({},item)
                }else{
                    item[children] && _find(item[children])
                }
            }
        })
    }
    _find(newArray)
    return findItem
}
/**
 * 按每N个元素分割成二维数组
 */
Util.splitArray = (N,Q) => {
    let R = [],F;
    for (F = 0;F < Q.length;) R.push(Q.slice(F,F += N))
    return R
}

/**
 * 将树形json某一字段全部取出存入数组
 * @onlyChildren 是否只显示children为空的字段
 */
Util.treeToArray = (json, key, onlyChildren) => {
    let arr = [], _json = Object.assign({},json)
    let doPush = (item) => {
        if(onlyChildren){
            if (!item.children || item.children.length===0){
                arr.push(item[key])
            }
        }else{
            arr.push(item[key])
        }
    }
    if(_json && key){
        if(json[key]){
            doPush(json)
            let _valtoArr = _arr => {
                _arr.forEach(item => {
                    if(item[key]){
                        doPush(item)
                    }
                    if(item.children && item.children.length>0){
                        _valtoArr(item.children) 
                    }
                })
            }
            if(json.children && json.children.length>0){
                _valtoArr(json.children)
            }
        }
    }
    return arr
}

/**
 * 将数字转换为汉字
 * @param {Number} money 
 */
Util.convertCurrency = (money) => {  
    //汉字的数字  
    let cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');  
    //基本单位  
    let cnIntRadice = new Array('', '拾', '佰', '仟');  
    //对应整数部分扩展单位  
    let cnIntUnits = new Array('', '万', '亿', '兆');  
    //对应小数部分单位  
    let cnDecUnits = new Array('角', '分', '毫', '厘');  
    //整数金额时后面跟的字符  
    let cnInteger = '整';  
    //整型完以后的单位  
    let cnIntLast = '元';  
    //最大处理的数字  
    let maxNum = 999999999999999.9999;  
    //金额整数部分  
    let integerNum;  
    //金额小数部分  
    let decimalNum;  
    //输出的中文金额字符串  
    let chineseStr = '';  
    //分离金额后用的数组，预定义  
    let parts;  
    if (money == '') { return ''; }  
    money = parseFloat(money);  
    if (money >= maxNum) {  
        //超出最大处理数字  
        return '';  
    }  
    if (money == 0) {  
        chineseStr = cnNums[0] + cnIntLast + cnInteger;  
        return chineseStr;  
    }  
    //转换为字符串  
    money = money.toString();  
    if (money.indexOf('.') == -1) {  
        integerNum = money;  
        decimalNum = '';  
    } else {  
        parts = money.split('.');  
        integerNum = parts[0];  
        decimalNum = parts[1].substr(0, 4);  
    }  
    //获取整型部分转换  
    if (parseInt(integerNum, 10) > 0) {  
        let zeroCount = 0;  
        let IntLen = integerNum.length;  
        for (let i = 0; i < IntLen; i++) {  
            let n = integerNum.substr(i, 1);  
            let p = IntLen - i - 1;  
            let q = p / 4;  
            let m = p % 4;  
            if (n == '0') {  
                zeroCount++;  
            } else {  
                if (zeroCount > 0) {  
                    chineseStr += cnNums[0];  
                }  
                //归零  
                zeroCount = 0;  
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];  
            }  
            if (m == 0 && zeroCount < 4) {  
                chineseStr += cnIntUnits[q];  
            }  
        }  
        chineseStr += cnIntLast;  
    }  
    //小数部分  
    if (decimalNum != '') {  
        let decLen = decimalNum.length;  
        for (let i = 0; i < decLen; i++) {  
            let n = decimalNum.substr(i, 1);  
            if (n != '0') {  
                chineseStr += cnNums[Number(n)] + cnDecUnits[i];  
            }
        }  
    }  
    if (chineseStr == '') {  
        chineseStr += cnNums[0] + cnIntLast + cnInteger;  
    } else if (decimalNum == '') {  
        chineseStr += cnInteger;  
    }  
    return chineseStr;  
}

export default Util;