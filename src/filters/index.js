import moment from 'moment'
import { convertType } from '@/util/constant.js'

/**
 * 时间戳转日期字符串
 * @param {time} date 
 */
export function toDateFilter(date) {
    return date ? moment(date).format('YYYY-MM-DD') : "尚未填写";
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
    return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * 10000 => 10,000.00
 * @param {number} s 
 * @param {digit} n 
 */
export function toMoneyFilter(s, n) {
    if(typeof s === 'undefined' || s===null) s=0
    n = n >= 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d.-]/g, "")).toFixed(n) + "";
    let l = s.split(".")[0].split("").reverse(),
        r = n >0 ? '.'+s.split(".")[1] : '';
    let t = "",i;
    for(i = 0; i < l.length; i ++ ){
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + r;
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export function toTypeConvert(value, constants, key) {
    if(!constants) return value
    let constant = convertType(value, constants)
    key = key ? key : 'label'
    return constant[key] ? constant[key] : value
}